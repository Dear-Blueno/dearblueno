import User from "../models/User";
import { completedDay, shiftDay } from "./calendar";

// Run after raw restore verification, using the last successful legacy cron log.
export async function initializeLegacyCheckpoint(
  day: string,
  now = new Date()
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
    shiftDay(day, 0) !== day ||
    day > completedDay(now)
  ) {
    throw new Error("A valid completed legacy streak day is required");
  }
  return User.updateMany(
    { lastStreakDate: { $exists: false } },
    { $set: { lastStreakDate: day } }
  );
}
