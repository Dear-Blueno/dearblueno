import mongoose from "mongoose";

// connect to MongoDB
export function mongoConnection() {
  mongoose.connect(process.env.MONGODB_URI || "", () => {
    console.log("Connected to MongoDB!");
  });
}
