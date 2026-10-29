/* eslint-disable no-await-in-loop -- Build indexes sequentially to limit free-cluster load. */
import dotenv from "dotenv";
import mongoose from "mongoose";
import connect from "./mongo";
import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Event from "../models/Event";
import Report from "../models/Report";
import JobRun from "../models/JobRun";
dotenv.config();
void (async () => {
  await connect();
  for (const model of [User, Post, Comment, Event, Report, JobRun])
    await model.createIndexes();
  console.info("Application indexes ready");
})()
  .catch(() => {
    console.error("Index creation failed");
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
