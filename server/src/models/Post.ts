import { model, Schema } from "mongoose";

const PostSchema = new Schema({
  postNumber: {
    type: Number,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  verifiedBrown: {
    type: Boolean,
    default: true,
  },
  contentWarning: {
    type: String,
    required: false,
  },
  postTime: {
    type: Date,
    default: Date.now,
  },
  approvedTime: {
    type: Date,
    required: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  reactions: [
    [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  ],
});
PostSchema.index({ content: "text" });

export interface IPost {
  postNumber: number;
  content: string;
  verifiedBrown: boolean;
  contentWarning: string;
  postTime: Date;
  approvedTime: Date;
  approved: boolean;
  approvedBy: any;
  comments: any[];
  reactions: any[][];
}

const Post = model<IPost>("Post", PostSchema);
export default Post;
