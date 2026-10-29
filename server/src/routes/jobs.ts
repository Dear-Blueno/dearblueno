import { timingSafeEqual } from "crypto";
import { Router } from "express";
import JobRun from "../models/JobRun";
import { verifySheets } from "../jobs/sheets";
import { runDaily } from "../jobs/daily";

const router = Router();
router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  const expected = Buffer.from(`Bearer ${process.env.CRON_SECRET ?? ""}`);
  const supplied = Buffer.from(req.get("authorization") ?? "");
  if (
    !process.env.CRON_SECRET ||
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    res.sendStatus(401);
    return;
  }
  next();
});
router.get("/status", async (_req, res) => {
  const latest = await JobRun.findOne({ completedAt: { $exists: true } }).sort({
    completedAt: -1,
  });
  const healthy =
    !!latest?.completedAt &&
    Date.now() - latest.completedAt.getTime() < 36 * 3600000;
  res
    .status(healthy ? 200 : 503)
    .json({ healthy, lastSuccess: latest?.completedAt ?? null });
});
router.get("/readiness", async (_req, res) => {
  await verifySheets();
  res.json({ healthy: true });
});
router.get("/daily", async (_req, res) => {
  if (process.env.JOBS_ENABLED !== "true") {
    res.sendStatus(403);
    return;
  }
  const result = await runDaily();
  res.status(result.status === "busy" ? 409 : 200).json(result);
});
export default router;
