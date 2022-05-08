import IUser from "./IUser";

export default interface IComment {
  _id: string;
  commentNumber: number;
  parentCommentNumber: number;
  parentComment?: any;
  post: any;
  postNumber: number;
  content: string;
  author?: IUser;
  commentTime: string; // ISO-8601-formatted date
  approved: boolean;
  needsReview: boolean;
  reactions: any[][];
}
