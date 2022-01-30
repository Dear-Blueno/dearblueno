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
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    required: false,
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
    required: false,
  },
  commentTime: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: true,
  },
  needsReview: {
    type: Boolean,
    default: false,
  },
  reactions: {
    type: [
      [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    ],
    default: [[], [], [], [], [], []],
  },
});

export interface IComment {
  _id: string;
  commentNumber: number;
  parentCommentNumber: number;
  parentComment: any;
  post: any;
  postNumber: number;
  content: string;
  author: any;
  commentTime: Date;
  approved: boolean;
  needsReview: boolean;
  reactions: any[][];
}

const Comment = model<IComment>("Comment", CommentSchema);
export default Comment;
