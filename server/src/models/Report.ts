import { model, Schema } from "mongoose";

const ReportSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  timeSubmitted: {
    type: Date,
    default: Date.now,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

export interface IReport {
  _id: string;
  post: any;
  comment: any;
  reason: string;
  timeSubmitted: Date;
  resolved: boolean;
  resolvedBy: any;
}

const Report = model<IReport>("Report", ReportSchema);
export default Report;
