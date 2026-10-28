import { model, Schema } from "mongoose";

const JobRun = model(
  "JobRun",
  new Schema({
    _id: { type: String, required: true },
    owner: String,
    leaseUntil: Date,
    startedAt: Date,
    completedAt: Date,
    failedAt: Date,
    completedSteps: { type: [String], default: [] },
    status: String,
  })
);
export default JobRun;
