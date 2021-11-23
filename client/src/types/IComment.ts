import IUser from "./IUser";

export default interface IComment {
  commentNumber: number;
  parentCommentNumber: number;
  post: any;
  postNumber: number;
  content: string;
  author: IUser;
  commentTime: Date;
  approved: boolean;
  reactions: any[][];
}
