export default interface IUser {
  googleId: string;
  name: string;
  email: string;
  profilePicture: string;
  bio?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  concentration?: string;
  classYear?: string;
  createdAt: Date;
  lastLoggedIn: Date;
  level: number;
  commentsCount: number;
  moderator: boolean;
}
