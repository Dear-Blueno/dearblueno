// Jest 29's VM cannot use the runtime adapter's native import. Use the same real
// library through Jest's existing ESM syntax transformer for this opt-in test.
jest.mock(
  "../../jobs/loadSheets.cjs",
  () => () => Promise.resolve(jest.requireActual("google-spreadsheet"))
);
import { JWT } from "google-auth-library";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import setupForTests from "../testUtil";
import Post from "../../models/Post";
import { hourlySheetsJob } from "../../config/cron-hourly";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

describe("Hourly Cron (E2E)", () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    const { db } = await setupForTests();
    mongo = db;

    const id = process.env.TESTING_GOOGLE_SHEET_ID;
    if (
      !id ||
      [
        process.env.VERIFIED_GOOGLE_SHEET_ID,
        process.env.UNVERIFIED_GOOGLE_SHEET_ID,
      ].includes(id)
    ) {
      throw new Error(
        "A dedicated test Sheet, distinct from production Sheets, is required"
      );
    }
    process.env.VERIFIED_GOOGLE_SHEET_ID = id;
    process.env.UNVERIFIED_GOOGLE_SHEET_ID = id;
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  describe("Hourly Sheets Job", () => {
    let document: GoogleSpreadsheet;
    let sheet: GoogleSpreadsheetWorksheet;

    beforeAll(() => {
      // Setup connection to google spreadsheet
      const auth = new JWT({
        email: process.env.GOOGLE_SHEET_CLIENT_EMAIL ?? "",
        key: process.env.GOOGLE_SHEET_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      document = new GoogleSpreadsheet(
        process.env.VERIFIED_GOOGLE_SHEET_ID ?? "",
        auth
      );
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
      await hourlySheetsJob();

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

      await hourlySheetsJob();

      const rows = await sheet.getRows();
      const imported = rows.filter((row) => row.get("Post"));
      expect(imported).toHaveLength(3);
      expect(
        imported.every((row) => row.get("ImportId") && row.get("ImportedAt"))
      ).toBe(true);

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

      await hourlySheetsJob();

      const rows = await sheet.getRows();
      const imported = rows.filter((row) => row.get("Post"));
      expect(imported).toHaveLength(3);
      expect(
        imported.every((row) => row.get("ImportId") && row.get("ImportedAt"))
      ).toBe(true);

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
    await mongo.stop();
  });
});
