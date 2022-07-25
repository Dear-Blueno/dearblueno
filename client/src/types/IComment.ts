import IUser from "./IUser";
import IPost from "./IPost";

export default interface IComment {
  _id: string;
  commentNumber: number;
  parentCommentNumber: number;
  parentComment?: IComment;
  post: IPost;
  postNumber: number;
  content: string;
  author?: IUser;
  commentTime: string; // ISO-8601-formatted date
  approved: boolean;
  needsReview: boolean;
  reactions: string[][];
}

export interface ICommentReactions {
  _id: string;
  reactions: string[][];
}
