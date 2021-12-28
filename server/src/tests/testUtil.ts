import mongoose from "mongoose";
import express from "express";
import postsRouter from "../routes/posts";
import userRouter from "../routes/user";
import authRouter from "../routes/auth";

export default async function setupForTests() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URL || "");

  // Init the mongoose models
  require("../models/User");
  require("../models/Post");
  require("../models/Comment");

  // Setup Express server
  const app = express();
  app.use(express.json());

  app.use("/posts", postsRouter);
  app.use("/user", userRouter);
  app.use("/auth", authRouter);

  return app;
}

export async function resetCollections() {
  // Clear all the data from each collection
  for (const collection in mongoose.connection.collections) {
    await mongoose.connection.collections[collection].deleteMany({});
  }
}
