import { model, Schema } from "mongoose";

const CommentSchema = new Schema({
  commentNumber: {
    type: Number,
    required: true,
  },
  parentCommentNumber: {
    type: Number,
    default: -1,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  postNumber: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commentTime: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: true,
  },
  reactions: [
    [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  ],
});

export interface IComment extends Document {
  commentNumber: number;
  parentCommentNumber: number;
  post: any;
  postNumber: number;
  content: string;
  author: any;
  commentTime: Date;
  approved: boolean;
  reactions: any[][];
}

const Comment = model<IComment>("Comment", CommentSchema);
export default Comment;
