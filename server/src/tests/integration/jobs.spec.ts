import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import type { Express } from "express";
import setupForTests from "../testUtil";
import { runDaily } from "../../jobs/daily";
import { ensureSheetHeaders, importRows, ImportRow } from "../../jobs/sheets";
import JobRun from "../../models/JobRun";
import Post from "../../models/Post";
import User from "../../models/User";
import Event from "../../models/Event";
import { notifyEvents } from "../../jobs/maintenance";

const now = new Date("2026-10-28T09:00:00Z");
const noop = () => Promise.resolve();
describe("Serverless jobs", () => {
  let mongo: MongoMemoryServer, app: Express;
  beforeAll(async () => {
    const result = await setupForTests();
    mongo = result.db;
    app = result.server;
  });
  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    process.env.CRON_SECRET = "test-secret";
  });
  afterAll(async () => {
    delete process.env.CRON_SECRET;
    delete process.env.JOBS_ENABLED;
    await mongoose.disconnect();
    await mongo.stop();
  });
  it("requires a secret, disables staging jobs, and reports stale status", async () => {
    await request(app).get("/internal/jobs/daily").expect(401);
    await request(app)
      .get("/internal/jobs/daily")
      .set("Authorization", "Bearer test-secret")
      .expect(403);
    await request(app)
      .get("/internal/jobs/status")
      .set("Authorization", "Bearer test-secret")
      .expect(503);
  });
  it("checkpoints successful stages and resumes a failed stage", async () => {
    const sheets = jest.fn(noop),
      reminders = jest.fn(noop);
    reminders.mockRejectedValueOnce(new Error("interrupted"));
    const steps = { sheets, reminders, hotScores: noop, streaks: noop };
    await expect(runDaily(now, steps)).rejects.toThrow("interrupted");
    await expect(runDaily(now, steps)).resolves.toMatchObject({
      status: "completed",
    });
    await expect(runDaily(now, steps)).resolves.toMatchObject({
      status: "already-completed",
    });
    expect(sheets).toHaveBeenCalledTimes(1);
    expect(reminders).toHaveBeenCalledTimes(2);
  });
  it("refuses overlapping execution and allows an expired lease", async () => {
    await JobRun.create({
      _id: "daily-lock",
      owner: "other",
      leaseUntil: new Date(Date.now() + 60000),
    });
    const steps = {
      sheets: noop,
      reminders: noop,
      hotScores: noop,
      streaks: noop,
    };
    await expect(runDaily(now, steps)).resolves.toMatchObject({
      status: "busy",
    });
    await JobRun.updateOne({ _id: "daily-lock" }, { leaseUntil: new Date(0) });
    await expect(runDaily(now, steps)).resolves.toMatchObject({
      status: "completed",
    });
  });
  it("retries a Sheet marker failure without duplicating posts or clearing rows", async () => {
    await Post.createIndexes();
    let failed = false;
    const row: ImportRow = {
      timestamp: now.toISOString(),
      content: "A submission",
      save: (id, processed) => {
        row.importId = id;
        if (processed && !failed) {
          failed = true;
          throw new Error("Sheet failure");
        }
        row.processed = processed;
        return Promise.resolve();
      },
    };
    await expect(importRows("sheet", true, [row], noop)).rejects.toThrow(
      "Sheet failure"
    );
    await importRows("sheet", true, [row], noop);
    await importRows("sheet", true, [row], noop);
    expect(await Post.countDocuments()).toBe(1);
    expect(row.content).toBe("A submission");
    expect(row.processed).toBeTruthy();
  });
  it("does not insert when persisting a Sheet identity fails", async () => {
    await expect(
      importRows(
        "sheet",
        true,
        [
          {
            timestamp: now.toISOString(),
            content: "post",
            save: () => Promise.reject(new Error("identity failure")),
          },
        ],
        noop
      )
    ).rejects.toThrow("identity failure");
    expect(await Post.countDocuments()).toBe(0);
  });
  it("covers the 25-hour reminder window and resumes after an event marker failure", async () => {
    const user = await User.create({
      googleId: "u",
      name: "User",
      email: "u@example.com",
      profilePicture: "https://example.com/a.png",
    });
    const event = await Event.create({
      eventName: "Tomorrow",
      eventDescription: "event",
      location: "Brown",
      approved: true,
      going: [user._id],
      interested: [user._id],
      startDate: new Date(now.getTime() + 24 * 3600000),
      endDate: new Date(now.getTime() + 25 * 3600000),
    });
    await notifyEvents(now);
    await Event.updateOne({ _id: event._id }, { notificationSent: false });
    await notifyEvents(now);
    expect((await User.findById(user._id))?.notifications).toHaveLength(1);
    await Promise.all(
      (
        [
          [-1, true],
          [26, true],
          [2, false],
        ] as const
      ).map(([offset, approved]) =>
        Event.create({
          eventName: "Excluded",
          eventDescription: "event",
          location: "Brown",
          approved,
          going: [user._id],
          startDate: new Date(now.getTime() + offset * 3600000),
          endDate: new Date(now.getTime() + 27 * 3600000),
        })
      )
    );
    await notifyEvents(now);
    expect((await User.findById(user._id))?.notifications).toHaveLength(1);
  });
  it("initializes a blank Sheet header without clearing any submission rows", async () => {
    const sheet = {
      headerValues: [] as string[],
      columnCount: 2,
      rowCount: 100,
      loadHeaderRow: () =>
        Promise.reject(
          new Error("No values in the header row - fill the first row")
        ),
      resize: jest.fn(() => Promise.resolve()),
      setHeaderRow: jest.fn((headers: string[]) => {
        sheet.headerValues = headers;
        return Promise.resolve();
      }),
    };
    await ensureSheetHeaders(sheet);
    expect(sheet.headerValues).toEqual([
      "Timestamp",
      "Post",
      "ImportId",
      "ImportedAt",
    ]);
    expect(sheet.resize).toHaveBeenCalledWith({
      rowCount: 100,
      columnCount: 4,
    });
  });
  it("propagates Sheet access failures instead of treating them as empty", async () => {
    const sheet = {
      headerValues: [],
      columnCount: 2,
      rowCount: 100,
      loadHeaderRow: () => Promise.reject(new Error("Access denied")),
      resize: jest.fn(() => Promise.resolve()),
      setHeaderRow: jest.fn(() => Promise.resolve()),
    };
    await expect(ensureSheetHeaders(sheet)).rejects.toThrow("Access denied");
    expect(sheet.setHeaderRow).not.toHaveBeenCalled();
  });
});
