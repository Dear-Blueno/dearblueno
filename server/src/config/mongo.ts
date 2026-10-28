import mongoose from "mongoose";

let pending: Promise<typeof mongoose> | undefined;
let pendingUri: string | undefined;

export default async function mongoConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  if (
    mongoose.connection.readyState === mongoose.ConnectionStates.connected &&
    pendingUri === uri
  )
    return mongoose;
  if (
    !pending ||
    pendingUri !== uri ||
    mongoose.connection.readyState === mongoose.ConnectionStates.disconnected
  ) {
    pendingUri = uri;
    pending = mongoose.connect(uri, {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 10000,
      autoIndex: process.env.NODE_ENV !== "production",
    });
  }
  try {
    return await pending;
  } catch (error) {
    pending = undefined;
    throw error;
  }
}
