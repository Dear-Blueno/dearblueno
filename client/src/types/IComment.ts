export default interface IComment {
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
