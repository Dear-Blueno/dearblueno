import mongoose from "mongoose";
import express from "express";
import postsRouter from "../routes/posts";
import userRouter from "../routes/user";
import authRouter from "../routes/auth";
import eventsRouter from "../routes/events";

export default async function setupForTests() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URL ?? "");

  // Init the mongoose models
  require("../models/User");
  require("../models/Post");
  require("../models/Comment");
  require("../models/Event");
  require("../models/Report");

  // Setup Express server
  const app = express();
  app.use(express.json());

  app.use("/posts", postsRouter);
  app.use("/user", userRouter);
  app.use("/auth", authRouter);
  app.use("/events", eventsRouter);

  return app;
}

export async function resetCollections() {
  // Clear all the data from each collection
  const promises = [];
  for (const collection in mongoose.connection.collections) {
    promises.push(mongoose.connection.collections[collection].deleteMany({}));
  }
  await Promise.all(promises);
}
