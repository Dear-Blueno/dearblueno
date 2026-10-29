/* eslint-disable no-await-in-loop -- Stages must checkpoint sequentially. */
import { randomUUID } from "crypto";
import JobRun from "../models/JobRun";
import { completedDay } from "./calendar";
import { importSheets } from "./sheets";
import { updateStreaks, notifyEvents, updateHotScores } from "./maintenance";

export async function runDaily(
  now = new Date(),
  steps = {
    sheets: importSheets,
    reminders: notifyEvents,
    hotScores: updateHotScores,
    streaks: updateStreaks,
  }
) {
  const day = completedDay(now);
  const owner = randomUUID();
  const started = Date.now();
  await JobRun.updateOne(
    { _id: "daily-lock" },
    { $setOnInsert: { leaseUntil: new Date(0) } },
    { upsert: true }
  );
  const lock = await JobRun.findOneAndUpdate(
    { _id: "daily-lock", leaseUntil: { $lte: new Date() } },
    {
      $set: { owner, leaseUntil: new Date(Date.now() + 6 * 60000) },
    },
    { new: true }
  );
  if (!lock) return { status: "busy", day };
  const checkpoint = async () => {
    if (Date.now() - started > 4 * 60000)
      throw new Error(
        "Daily job exceeded four-minute budget; resume to continue"
      );
    if (
      !(await JobRun.exists({
        _id: "daily-lock",
        owner,
        leaseUntil: { $gt: new Date() },
      }))
    ) {
      throw new Error("Daily job lease lost");
    }
  };
  try {
    const run = await JobRun.findOneAndUpdate(
      { _id: `daily:${day}` },
      {
        $setOnInsert: { startedAt: new Date(), status: "running" },
      },
      { upsert: true, new: true }
    );
    if (run.completedAt) return { status: "already-completed", day };
    for (const [name, step] of Object.entries(steps)) {
      if (run.completedSteps.includes(name)) continue;
      await checkpoint();
      if (name === "sheets") await (step as typeof importSheets)(checkpoint);
      else await (step as typeof updateStreaks)(now, checkpoint);
      await checkpoint();
      await JobRun.updateOne(
        { _id: `daily:${day}` },
        { $addToSet: { completedSteps: name } }
      );
    }
    await JobRun.updateOne(
      { _id: `daily:${day}` },
      {
        $set: { status: "completed", completedAt: new Date() },
        $unset: { failedAt: 1 },
      }
    );
    return { status: "completed", day };
  } catch (error) {
    await JobRun.updateOne(
      { _id: `daily:${day}` },
      { $set: { status: "failed", failedAt: new Date() } }
    );
    throw error;
  } finally {
    await JobRun.updateOne(
      { _id: "daily-lock", owner },
      { $set: { leaseUntil: new Date(0) } }
    );
  }
}
