import IComment from "./IComment";
import IPost from "./IPost";
import IUser from "./IUser";

export interface IReport {
  _id: string;
  post: IPost;
  comment: IComment;
  reason: string;
  timeSubmitted: Date;
  resolved: boolean;
  resolvedBy?: IUser;
}
