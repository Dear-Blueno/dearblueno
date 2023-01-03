/*
 * This file is a script that can be run to manually trigger the
 * Google Sheets job (typically run hourly via the cron job).
 */

import log4js from "log4js";
import dotenv from "dotenv";
import mongoConnection from "./mongo";
import { hourlySheetsJob } from "./cron-hourly";

// Setup logger
log4js.configure({
  appenders: { app: { type: "stdout" } },
  categories: { default: { appenders: ["app"], level: "debug" } },
});
const logger = log4js.getLogger("app");

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();
if (!process.env.MONGODB_URI) {
  logger.fatal("Required environment variables are missing! Exiting...");
  process.exit(1);
}

// Setup MongoDB
mongoConnection();

// Log the sheets from env variables
logger.info(`Verified Sheet ID: ${process.env.VERIFIED_GOOGLE_SHEET_ID}`);
logger.info(`Unverified Sheet ID: ${process.env.UNVERIFIED_GOOGLE_SHEET_ID}`);

// Run the job
hourlySheetsJob()
  .then(() => {
    logger.info("Job completed successfully!");
    process.exit(0);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
