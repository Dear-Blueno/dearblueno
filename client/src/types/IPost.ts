import IComment from "./IComment";

export default interface IPost {
  _id: string;
  postNumber: number;
  content: string;
  verifiedBrown: boolean;
  contentWarning: string;
  postTime: Date;
  approvedTime: Date;
  approved: boolean;
  approvedBy: any;
  comments: IComment[];
  reactions: any[][];
}
