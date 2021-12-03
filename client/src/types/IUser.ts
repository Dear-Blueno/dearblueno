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
  xp: number;
  streakDays: number;
  commentsCount: number;
  verifiedBrown: boolean;
  moderator: boolean;
}
