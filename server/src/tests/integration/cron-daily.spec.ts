import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import setupForTests from "../testUtil";
import User from "../../models/User";
import { dailyJob } from "../../config/cron-daily";

describe("Cron Daily", () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    const { db } = await setupForTests();
    mongo = db;
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  describe("Daily Job", () => {
    it("should properly award xp for streaks", async () => {
      const user = new User({
        googleId: "123",
        name: "John Doe",
        email: "john@dearblueno.net",
        profilePicture: "https://i.imgur.com/removed.png",
      });
      await user.save();

      await dailyJob();

      const updatedUser = await User.findOne();
      expect(updatedUser?.streakDays).toBe(1);
      expect(updatedUser?.xp).toBe(0);

      await dailyJob();

      const updatedUser2 = await User.findOne();
      expect(updatedUser2?.streakDays).toBe(2);
      expect(updatedUser2?.xp).toBe(0);

      await dailyJob();

      const updatedUser3 = await User.findOne();
      expect(updatedUser3?.streakDays).toBe(3);
      expect(updatedUser3?.xp).toBe(5);

      await User.findOneAndUpdate(
        {},
        {
          streakDays: 14,
        }
      );

      await dailyJob();

      const updatedUser4 = await User.findOne();
      expect(updatedUser4?.streakDays).toBe(15);
      expect(updatedUser4?.xp).toBe(15);
    });

    it("should properly award badges for streaks", async () => {
      const user = new User({
        googleId: "123",
        name: "John Doe",
        email: "john@dearblueno.net",
        profilePicture: "https://i.imgur.com/removed.png",
        streakDays: 6,
      });
      await user.save();

      await dailyJob();

      const updatedUser = await User.findOne();
      const badges = updatedUser?.badges ?? [];
      expect(badges).toContain("One Week Streak");
      expect(badges).not.toContain("One Month Streak");

      await User.findOneAndUpdate(
        {},
        {
          streakDays: 29,
        }
      );

      await dailyJob();

      const updatedUser2 = await User.findOne();
      const badges2 = updatedUser2?.badges ?? [];
      expect(badges2).toContain("One Month Streak");
      expect(badges2).toContain("One Week Streak");
    });

    it("should properly kill broken streaks", async () => {
      const user = new User({
        googleId: "123",
        name: "John Doe",
        email: "john@dearblueno.net",
        profilePicture: "https://i.imgur.com/removed.png",
        streakDays: 6,
        lastLoggedIn: Date.now() - 1000 * 60 * 60 * 24 * 2,
      });
      await user.save();

      await dailyJob();

      const updatedUser = await User.findOne();
      expect(updatedUser?.streakDays).toBe(0);
      expect(updatedUser?.xp).toBe(0);
      expect(updatedUser?.badges.length).toBe(0);

      await dailyJob();

      const updatedUser2 = await User.findOne();
      expect(updatedUser2?.streakDays).toBe(0);
      expect(updatedUser2?.xp).toBe(0);
      expect(updatedUser2?.badges.length).toBe(0);
    });

    it("should properly award Top Fan badges to most active users", async () => {
      // Create 100 dummy users with 11 xp each
      const promises = [];
      for (let i = 1; i <= 100; i++) {
        promises.push(
          new User({
            googleId: `${i}`,
            name: `User ${i}`,
            email: "user@dearblueno.net",
            profilePicture: "https://i.imgur.com/removed.png",
            xp: 11,
            badges: ["Top Fan"],
          }).save()
        );
      }
      await Promise.all(promises);

      // Create one active user with 300 xp
      const activeUser = new User({
        googleId: "activeUser",
        name: "Active User",
        email: "activeuser@dearblueno.net",
        profilePicture: "https://i.imgur.com/removed.png",
        xp: 300,
      });
      await activeUser.save();

      // Run daily job
      await dailyJob();

      // Check that the active user has the Top Fan badge
      const user = await User.findOne({ googleId: "activeUser" });
      const badges = user?.badges ?? [];
      expect(badges).toContain("Top Fan");
      expect(badges.filter((badge) => badge === "Top Fan").length).toBe(1);
      expect(await User.countDocuments({ badges: "Top Fan" })).toBe(1);

      // Result should sustain after running daily job again
      await dailyJob();

      const user2 = await User.findOne({ googleId: "activeUser" });
      const badges2 = user2?.badges ?? [];
      expect(badges2).toContain("Top Fan");
      expect(badges2.filter((badge) => badge === "Top Fan").length).toBe(1);
      expect(await User.countDocuments({ badges: "Top Fan" })).toBe(1);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });
});
