import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import setupForTests from "../testUtil";
import User from "../../models/User";
import { initializeLegacyCheckpoint } from "../../jobs/legacyCheckpoint";
import { updateStreaks } from "../../jobs/maintenance";
import { completedDay, easternDay } from "../../jobs/calendar";

const now = new Date("2026-10-28T09:00:00Z");
const fixture = {
  googleId: "123",
  name: "User",
  email: "user@example.com",
  profilePicture: "https://example.com/a.png",
};
describe("Daily streaks", () => {
  let mongo: MongoMemoryServer;
  beforeAll(async () => {
    mongo = (await setupForTests()).db;
  });
  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it("awards XP and badges once per completed Eastern day", async () => {
    const user = await User.create({
      ...fixture,
      streakDays: 29,
      loginDays: ["2026-10-27"],
      lastLoggedIn: new Date("2026-10-27T12:00:00Z"),
    });
    await updateStreaks(now);
    await updateStreaks(now);
    const result = await User.findById(user._id);
    expect(result?.streakDays).toBe(30);
    expect(result?.xp).toBe(10);
    expect(result?.badges).toContain("One Month Streak");
    expect(result?.lastStreakDate).toBe("2026-10-27");
  });
  it("does not credit today's login to yesterday", async () => {
    await User.create({
      ...fixture,
      streakDays: 6,
      lastLoggedIn: now,
      loginDays: ["2026-10-28"],
    });
    await updateStreaks(now);
    expect((await User.findOne())?.streakDays).toBe(0);
  });
  it("catches up missed days and resets gaps", async () => {
    await User.create({
      ...fixture,
      streakDays: 6,
      lastStreakDate: "2026-10-24",
      loginDays: ["2026-10-25", "2026-10-27"],
      lastLoggedIn: new Date("2026-10-27T12:00:00Z"),
    });
    await updateStreaks(now);
    const result = await User.findOne();
    expect(result?.streakDays).toBe(1);
    expect(result?.badges).toContain("One Week Streak");
  });
  it("prevents concurrent runs from awarding XP twice", async () => {
    await User.create({ ...fixture, streakDays: 2, loginDays: ["2026-10-27"] });
    await Promise.all([updateStreaks(now), updateStreaks(now)]);
    expect((await User.findOne())?.xp).toBe(5);
  });
  it("handles both DST transitions by calendar date", () => {
    expect(completedDay(new Date("2026-03-09T09:00:00Z"))).toBe("2026-03-08");
    expect(completedDay(new Date("2026-11-02T09:00:00Z"))).toBe("2026-11-01");
    expect(easternDay(new Date("2026-11-01T03:59:00Z"))).toBe("2026-10-31");
  });
  it("awards Top Fan without duplicates and removes it from other users", async () => {
    await User.create({ ...fixture, xp: 300 });
    await User.create({
      ...fixture,
      googleId: "other",
      xp: 10,
      badges: ["Top Fan"],
    });
    await updateStreaks(now);
    await updateStreaks(now);
    expect(await User.countDocuments({ badges: "Top Fan" })).toBe(1);
  });
  it("seeds the legacy completion date without awarding yesterday twice", async () => {
    const user = await User.create({
      ...fixture,
      streakDays: 2,
      lastLoggedIn: new Date("2026-10-27T12:00:00Z"),
    });
    await initializeLegacyCheckpoint("2026-10-27", now);
    await updateStreaks(now);
    expect((await User.findById(user._id))?.streakDays).toBe(2);
    expect((await User.findById(user._id))?.xp).toBe(0);
    await User.updateOne(
      { _id: user._id },
      { $addToSet: { loginDays: "2026-10-28" } }
    );
    await initializeLegacyCheckpoint("2026-10-27", now);
    await updateStreaks(new Date("2026-10-29T09:00:00Z"));
    expect((await User.findById(user._id))?.streakDays).toBe(3);
    expect((await User.findById(user._id))?.xp).toBe(5);
  });
});
