import mongoose from "mongoose";
import { logger } from "../index";

export default function mongoConnection() {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || "", () => {
    logger.info("Connected to MongoDB!");
  });
  // Init the mongoose models
  require("../models/User");
  require("../models/Post");
  require("../models/Comment");
}
