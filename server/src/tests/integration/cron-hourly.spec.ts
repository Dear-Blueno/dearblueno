import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import setupForTests from "../testUtil";
import { updateHotScores } from "../../jobs/maintenance";
import Post from "../../models/Post";

describe("Daily hot scores", () => {
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
  it("recomputes age decay idempotently, including old posts", async () => {
    const now = new Date("2026-10-28T09:00:00Z");
    const post = await Post.create({
      content: "post",
      approved: true,
      score: 50,
      approvedTime: new Date(now.getTime() - 8 * 24 * 3600000),
    });
    await updateHotScores(now);
    await updateHotScores(now);
    expect((await Post.findById(post._id))?.hotScore).toBe(50 - 2 * 8 * 24);
  });
  it("leaves unapproved posts unchanged and incorporates new scores", async () => {
    const now = new Date();
    const post = await Post.create({
      content: "post",
      approved: true,
      score: 3,
      approvedTime: now,
    });
    await Post.create({ content: "unapproved", hotScore: 7 });
    await updateHotScores(now);
    await Post.updateOne({ _id: post._id }, { $inc: { score: 3 } });
    await updateHotScores(now);
    expect((await Post.findById(post._id))?.hotScore).toBe(6);
    expect((await Post.findOne({ approved: false }))?.hotScore).toBe(7);
  });
});
