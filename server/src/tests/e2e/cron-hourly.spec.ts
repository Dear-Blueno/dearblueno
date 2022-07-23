import mongoose from "mongoose";
import dotenv from "dotenv";
import setupForTests from "../testUtil";
import Post from "../../models/Post";
import { hourlyJob } from "../../config/cron-hourly";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

describe("Hourly Cron (E2E)", () => {
  beforeAll(async () => {
    await setupForTests();
    dotenv.config();

    const id = process.env.TESTING_GOOGLE_SHEET_ID;
    process.env.VERIFIED_GOOGLE_SHEET_ID = id;
    process.env.UNVERIFIED_GOOGLE_SHEET_ID = id;
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  describe("Hourly Job", () => {
    let document: GoogleSpreadsheet;
    let sheet: GoogleSpreadsheetWorksheet;

    beforeAll(async () => {
      // Setup connection to google spreadsheet
      const creds = {
        client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL ?? "",
        private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY ?? "",
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
