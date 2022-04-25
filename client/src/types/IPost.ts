import IComment from "./IComment";

export default interface IPost {
  _id: string;
  postNumber: number;
  content: string;
  verifiedBrown: boolean;
  contentWarning: string;
  postTime: string; // ISO-8601-formatted date
  approvedTime: string; // ISO-8601-formatted date
  approved: boolean;
  needsReview: boolean;
  approvedBy: any;
  comments: IComment[];
  reactions: any[][];
}
