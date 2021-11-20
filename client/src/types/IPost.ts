export default interface IPost {
  postNumber: number;
  content: string;
  contentWarning: string;
  postTime: Date;
  approvedTime: Date;
  approved: boolean;
  approvedBy: any;
  comments: any[];
  reactions: any[][];
}
