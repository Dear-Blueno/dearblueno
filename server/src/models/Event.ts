import { model, Schema } from "mongoose";

const EventSchema = new Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: false,
  },
  coverPicture: {
    type: String,
    required: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  needsReview: {
    type: Boolean,
    default: true,
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  interested: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  going: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  postTime: {
    type: Date,
    default: Date.now,
  },
  approvedTime: {
    type: Date,
    required: false,
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
});

// Index by approved and startDate for faster queries
EventSchema.index({ approved: -1, startDate: 1 });

export interface IEvent {
  _id: string;
  eventName: string;
  eventDescription: string;
  startDate: Date;
  endDate: Date;
  location: string;
  contactEmail: string;
  coverPicture: string;
  approved: boolean;
  needsReview: boolean;
  approvedBy: string;
  interested: string[];
  going: string[];
  postTime: Date;
  approvedTime: Date;
  notificationSent: boolean;
}

const Event = model<IEvent>("Event", EventSchema);
export default Event;
