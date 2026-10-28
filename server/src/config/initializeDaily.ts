import dotenv from "dotenv";
import mongoose from "mongoose";
import connect from "./mongo";
import { initializeLegacyCheckpoint } from "../jobs/legacyCheckpoint";

dotenv.config();
void (async () => {
  const day = process.env.LEGACY_LAST_COMPLETED_STREAK_DAY;
  if (!day)
    throw new Error(
      "Set LEGACY_LAST_COMPLETED_STREAK_DAY from the legacy completion log"
    );
  await connect();
  const result = await initializeLegacyCheckpoint(day);
  console.info(
    `Legacy checkpoint initialized for ${result.modifiedCount} users; XP/streaks unchanged`
  );
})()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error
        ? error.message
        : "Checkpoint initialization failed"
    );
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
