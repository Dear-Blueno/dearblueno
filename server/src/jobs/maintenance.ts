import User from "../models/User";
import Event from "../models/Event";
import Post from "../models/Post";
import { completedDay, easternDay, shiftDay } from "./calendar";

export type Checkpoint = () => Promise<void>;
const noop: Checkpoint = () => Promise.resolve();

export async function updateStreaks(
  now = new Date(),
  checkpoint: Checkpoint = noop
) {
  const target = completedDay(now);
  for await (const user of User.find({
    $or: [
      { lastStreakDate: { $lt: target } },
      { lastStreakDate: { $exists: false } },
    ],
  }).cursor()) {
    await checkpoint();
    let day = user.lastStreakDate ? shiftDay(user.lastStreakDate, 1) : target;
    let streak = user.streakDays;
    let xp = 0;
    const badges: string[] = [];
    const milestones: Record<number, string> = {
      7: "One Week Streak",
      30: "One Month Streak",
      69: "Nice",
      365: "One Year Streak",
    };
    const loginDays = new Set(user.loginDays);
    // Preserve the last known login on migration; future logins record calendar days.
    loginDays.add(easternDay(user.lastLoggedIn));
    for (; day <= target; day = shiftDay(day, 1)) {
      const active = loginDays.has(day);
      streak = active ? streak + 1 : 0;
      if (active && streak % 3 === 0) xp += streak < 15 ? 5 : 10;
      if (active && milestones[streak]) badges.push(milestones[streak]);
    }
    await User.updateOne(
      {
        _id: user._id,
        lastStreakDate: user.lastStreakDate ?? { $exists: false },
      },
      {
        $set: { streakDays: streak, lastStreakDate: target },
        $inc: { xp },
        ...(badges.length ? { $addToSet: { badges: { $each: badges } } } : {}),
      }
    );
  }
  await checkpoint();
  const count = await User.countDocuments();
  const percentile = await User.findOne()
    .sort({ xp: -1 })
    .skip(Math.max(1, Math.floor(count * 0.01)));
  const minXp = Math.max(percentile?.xp ?? 9, 9) + 1;
  await User.updateMany(
    { xp: { $lt: minXp } },
    { $pull: { badges: "Top Fan" } }
  );
  await User.updateMany(
    { xp: { $gte: minXp } },
    { $addToSet: { badges: "Top Fan" } }
  );
}

export async function notifyEvents(
  now = new Date(),
  checkpoint: Checkpoint = noop
) {
  for await (const event of Event.find({
    approved: true,
    notificationSent: false,
    startDate: { $gt: now, $lte: new Date(now.getTime() + 25 * 3600000) },
  }).cursor()) {
    await checkpoint();
    const notification = {
      timestamp: now,
      type: "upcomingEvent",
      content: {
        eventId: event._id,
        eventName: event.eventName,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
      },
    };
    // The permanent per-user marker survives the notification list's 100-item cap.
    await User.updateMany(
      {
        _id: { $in: [...event.interested, ...event.going] },
        notifiedEventIds: { $ne: event._id },
      },
      {
        $addToSet: { notifiedEventIds: event._id },
        $push: { notifications: { $each: [notification], $slice: -100 } },
      }
    );
    await Event.updateOne(
      { _id: event._id },
      { $set: { notificationSent: true } }
    );
  }
}

export async function updateHotScores(now = new Date()) {
  // A database-side expression preserves concurrent reaction/comment increments.
  await Post.updateMany({ approved: true, approvedTime: { $type: "date" } }, [
    {
      $set: {
        hotScore: {
          $subtract: [
            "$score",
            {
              $multiply: [
                2,
                { $divide: [{ $subtract: [now, "$approvedTime"] }, 3600000] },
              ],
            },
          ],
        },
      },
    },
  ]);
}
