import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  googleId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  givenName: {
    type: String,
    required: false,
  },
  familyName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: false,
  },
  hometown: {
    type: String,
    required: false,
  },
  instagram: {
    type: String,
    required: false,
  },
  twitter: {
    type: String,
    required: false,
  },
  facebook: {
    type: String,
    required: false,
  },
  linkedin: {
    type: String,
    required: false,
  },
  concentration: {
    type: String,
    required: false,
  },
  classYear: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoggedIn: {
    type: Date,
    default: Date.now,
  },
  bannedUntil: {
    type: Date,
    required: false,
  },
  xp: {
    type: Number,
    default: 0,
  },
  streakDays: {
    type: Number,
    default: 0,
  },
  verifiedBrown: {
    type: Boolean,
    default: false,
  },
  moderator: {
    type: Boolean,
    default: false,
  },
  badges: {
    type: [String],
    default: [],
  },
});

// Non-sensitive user info that can be seen by everyone
export interface IBasicUser {
  _id: string;
  googleId: string;
  name: string;
  givenName: string;
  familyName: string;
  profilePicture: string;
  bio: string;
  hometown: string;
  instagram: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  concentration: string;
  classYear: string;
  createdAt: Date;
  xp: number;
  streakDays: number;
  verifiedBrown: boolean;
  badges: string[];
}

// Full user info that can only be seen by the user
export interface IUser extends IBasicUser {
  email: string;
  lastLoggedIn: Date;
  moderator: boolean;
  bannedUntil: Date;
}

const User = model<IUser>("User", UserSchema);
export default User;
