import mongoose from "mongoose";

export default function mongoConnection() {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || "", () => {
    console.log("Connected to MongoDB!");
  });
  // Init the mongoose models
  require("../models/User");
  require("../models/Post");
  require("../models/Comment");
}
