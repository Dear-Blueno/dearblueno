// Non-sensitive user info that can be seen by everyone
export interface IBasicUser {
  _id: string;
  googleId: string;
  name: string;
  givenName: string;
  familyName: string;
  profilePicture: string;
  bio?: string;
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

export interface INotification {
  _id: string;
  timestamp: Date;
  type: string;
  content: any;
}

export interface INewCommentNotification extends INotification {
  type: "newComment";
  content: {
    postNumber: number;
    userName: string;
    commentContent: string;
    profilePicture: string;
  };
}

export interface ITrendingPostNotification extends INotification {
  type: "trendingPost";
  content: {
    postNumber: number;
    content: string;
  };
}

export interface IUpcomingEventNotification extends INotification {
  type: "upcomingEvent";
  content: {
    eventId: string;
    eventName: string;
    location: string;
    startDate: Date;
    endDate: Date;
  };
}
