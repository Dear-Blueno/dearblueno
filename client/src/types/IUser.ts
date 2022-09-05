// Non-sensitive user info that can be seen by everyone
export interface IBasicUser {
  _id: string;
  googleId: string;
  name: string;
  displayName?: string;
  givenName: string;
  familyName: string;
  profilePicture: string;
  bio?: string;
  pronouns?: string;
  hometown?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
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
  moderator: boolean;
  bannedUntil?: Date;
  notifications: INotification[];
  bookmarks: string[];
  subscriptions: string[];
}

export type INotification =
  | INewCommentNotification
  | ITrendingPostNotification
  | IUpcomingEventNotification;

interface Notification {
  _id: string;
  read: boolean;
  timestamp: Date;
  type: "newComment" | "trendingPost" | "upcomingEvent";
  content: unknown;
}

export interface INewCommentNotification extends Notification {
  _id: string;
  timestamp: Date;
  type: "newComment";
  content: {
    postNumber: number;
    userName: string;
    commentContent: string;
    profilePicture: string;
  };
}

export interface ITrendingPostNotification extends Notification {
  _id: string;
  timestamp: Date;
  type: "trendingPost";
  content: {
    postNumber: number;
    content: string;
  };
}

export interface IUpcomingEventNotification extends Notification {
  _id: string;
  timestamp: Date;
  type: "upcomingEvent";
  content: {
    eventId: string;
    eventName: string;
    location: string;
    startDate: Date;
    endDate: Date;
  };
}
