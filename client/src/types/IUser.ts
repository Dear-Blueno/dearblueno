// Non-sensitive user info that can be seen by everyone
export interface IBasicUser {
  googleId: string;
  name: string;
  profilePicture: string;
  bio?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  concentration?: string;
  classYear?: string;
  createdAt: Date;
  xp: number;
  streakDays: number;
  verifiedBrown: boolean;
  badges: string[];
}

// Full user info that can only be seen by the user
export default interface IUser extends IBasicUser {
  email: string;
  lastLoggedIn: Date;
  commentsCount: number;
  moderator: boolean;
}
