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
  imageUrl: {
    type: String,
    required: false,
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
  needsReview: {
    type: Boolean,
    default: true,
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
  subscribers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  pinned: {
    type: Boolean,
    default: null,
  },
  score: {
    type: Number,
    default: 0,
  },
  hotScore: {
    type: Number,
    default: 0,
  },
});

// Index the text content of the post for full text search
PostSchema.index({ content: "text" });
// Index by approved, pinned, and postNumber for faster queries (sort by new)
PostSchema.index({ approved: -1, pinned: -1, postNumber: -1 });
// Index by approved, pinned, score, and postNumber for faster queries (sort by top)
PostSchema.index({ approved: -1, pinned: -1, score: -1, postNumber: -1 });
// Index by approved, pinned, hotScore, and postNumber for faster queries (sort by hot)
PostSchema.index({ approved: -1, pinned: -1, hotScore: -1, postNumber: -1 });

export interface IPost {
  _id: string;
  postNumber: number;
  content: string;
  imageUrl: string;
  verifiedBrown: boolean;
  contentWarning: string;
  postTime: Date;
  approvedTime: Date;
  approved: boolean;
  needsReview: boolean;
  approvedBy: any;
  comments: any[];
  reactions: any[][];
  pinned: boolean;
  subscribers: any[];
  score: number;
  hotScore: number;
}

const Post = model<IPost>("Post", PostSchema);
export default Post;
