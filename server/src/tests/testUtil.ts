import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import log4js from "log4js";
import app from "../app";

export default async function setupForTests() {
  // Create a MongoDB Memory Server
  const db = await MongoMemoryServer.create();
  process.env.MONGODB_URI = db.getUri();

  // Setup the app
  const server = app();
  log4js.shutdown();

  return { server, db };
}

export async function resetCollections() {
  // Clear all the data from each collection
  const promises = [];
  for (const collection in mongoose.connection.collections) {
    promises.push(mongoose.connection.collections[collection].deleteMany({}));
  }
  await Promise.all(promises);
}
