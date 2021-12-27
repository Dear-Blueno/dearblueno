import mongoose from "mongoose";
import dotenv from "dotenv";
import setupForTests from "./testUtil";
import User from "../models/User";
import Post from "../models/Post";
import { hourlyJob, dailyJob } from "../config/cron";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

describe("Cron", () => {
  beforeAll(async () => {
    await setupForTests();
    dotenv.config();
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
      const badges = updatedUser?.badges || [];
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
      const badges2 = updatedUser2?.badges || [];
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
      // Create 19 dummy users with 11 xp each
      for (let i = 1; i <= 20; i++) {
        await new User({
          googleId: `${i}`,
          name: `User ${i}`,
          email: "user@dearblueno.net",
          profilePicture: "https://i.imgur.com/removed.png",
          xp: 11,
          badges: ["Top Fan"],
        }).save();
      }

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
      const badges = user?.badges || [];
      expect(badges).toContain("Top Fan");
      expect(badges.filter((badge) => badge === "Top Fan").length).toBe(1);
      expect(await User.countDocuments({ badges: "Top Fan" })).toBe(1);

      // Result should sustain after running daily job again
      await dailyJob();

      const user2 = await User.findOne({ googleId: "activeUser" });
      const badges2 = user2?.badges || [];
      expect(badges2).toContain("Top Fan");
      expect(badges2.filter((badge) => badge === "Top Fan").length).toBe(1);
      expect(await User.countDocuments({ badges: "Top Fan" })).toBe(1);
    });
  });

  describe("Hourly Job", () => {
    let document: GoogleSpreadsheet;
    let sheet: GoogleSpreadsheetWorksheet;

    beforeAll(async () => {
      // Setup connection to google spreadsheet
      const creds = {
        client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL || "",
        private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY || "",
      };

      document = new GoogleSpreadsheet(process.env.VERIFIED_GOOGLE_SHEET_ID);
      await document.useServiceAccountAuth(creds);
    });

    beforeEach(async () => {
      await document.loadInfo();
      sheet = document.sheetsByIndex[0];

      // Clear the sheet
      await sheet.clear();
      await sheet.loadCells("A1:B1");
      sheet.getCellByA1("A1").value = "Timestamp";
      sheet.getCellByA1("B1").value = "Post";
      await sheet.saveUpdatedCells();
    });

    it("should properly handle the spreadsheet being empty", async () => {
      await hourlyJob();

      await sheet.loadCells("A1:B1");
      expect(sheet.getCellByA1("A1").value).toBe("Timestamp");
      expect(sheet.getCellByA1("B1").value).toBe("Post");

      expect(await Post.countDocuments()).toBe(0);
    }, 15000);

    it("should properly handle the spreadsheet being filled with posts", async () => {
      await sheet.addRow({
        Timestamp: "2020-01-01T00:00:00.000Z",
        Post: "Post 1",
      });
      await sheet.addRow({
        Timestamp: "2020-01-01T00:00:00.000Z",
        Post: "Post 2",
      });
      await sheet.addRow({
        Timestamp: "2020-01-01T00:00:00.000Z",
        Post: "Post 3",
      });

      await hourlyJob();

      await sheet.loadCells("A1:B5");
      expect(sheet.getCellByA1("A1").value).toBe("Timestamp");
      expect(sheet.getCellByA1("B1").value).toBe("Post");
      expect(sheet.getCellByA1("A2").value).toBe(null);
      expect(sheet.getCellByA1("B2").value).toBe(null);
      expect(sheet.getCellByA1("A3").value).toBe(null);
      expect(sheet.getCellByA1("B3").value).toBe(null);
      expect(sheet.getCellByA1("A4").value).toBe(null);
      expect(sheet.getCellByA1("B4").value).toBe(null);
      expect(sheet.getCellByA1("A5").value).toBe(null);
      expect(sheet.getCellByA1("B5").value).toBe(null);

      const posts = await Post.find();
      expect(posts.length).toBe(3);
      expect(posts[0].content).toBe("Post 1");
      expect(posts[1].content).toBe("Post 2");
      expect(posts[2].content).toBe("Post 3");
      expect(posts[0].postTime).toStrictEqual(
        new Date("2020-01-01T00:00:00.000Z")
      );
      expect(posts[0].verifiedBrown).toBe(true);
      expect(posts[0].approved).toBe(false);
    }, 15000);

    it("should properly handle sporadic empty rows of posts in the spreadsheet", async () => {
      await sheet.addRow({});
      await sheet.addRow({
        Timestamp: "2020-01-01T00:00:00.000Z",
        Post: "Post 1",
      });
      await sheet.addRow({
        Timestamp: "2020-01-01T00:00:00.000Z",
        Post: "Post 2",
      });
      await sheet.addRow({});
      await sheet.addRow({
        Timestamp: "2020-01-01T00:00:00.000Z",
        Post: "Post 3",
      });
      await sheet.addRow({});
      await sheet.addRow({});

      await hourlyJob();

      await sheet.loadCells("A1:B5");
      expect(sheet.getCellByA1("A1").value).toBe("Timestamp");
      expect(sheet.getCellByA1("B1").value).toBe("Post");
      expect(sheet.getCellByA1("A2").value).toBe(null);
      expect(sheet.getCellByA1("B2").value).toBe(null);
      expect(sheet.getCellByA1("A3").value).toBe(null);
      expect(sheet.getCellByA1("B3").value).toBe(null);
      expect(sheet.getCellByA1("A4").value).toBe(null);
      expect(sheet.getCellByA1("B4").value).toBe(null);
      expect(sheet.getCellByA1("A5").value).toBe(null);
      expect(sheet.getCellByA1("B5").value).toBe(null);

      const posts = await Post.find();
      expect(posts.length).toBe(3);
      expect(posts[0].content).toBe("Post 1");
      expect(posts[1].content).toBe("Post 2");
      expect(posts[2].content).toBe("Post 3");
      expect(posts[0].postTime).toStrictEqual(
        new Date("2020-01-01T00:00:00.000Z")
      );
      expect(posts[0].verifiedBrown).toBe(true);
      expect(posts[0].approved).toBe(false);
    }, 15000);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
