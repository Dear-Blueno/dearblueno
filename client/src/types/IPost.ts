import IComment, { ICommentReactions } from "./IComment";

export default interface IPost {
  _id: string;
  postNumber: number;
  content: string;
  imageUrl?: string;
  verifiedBrown: boolean;
  contentWarning: string;
  postTime: string; // ISO-8601-formatted date
  approvedTime: string; // ISO-8601-formatted date
  approved: boolean;
  needsReview: boolean;
  comments: IComment[];
  reactions: string[][];
  pinned: boolean;
}

export interface IPostReactions {
  _id: string;
  comments: ICommentReactions[];
  reactions: string[][];
}
