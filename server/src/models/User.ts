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
  level: {
    type: Number,
    default: 0,
  },
  streakDays: {
    type: Number,
    default: 0,
  },
  commentsCount: {
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

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  profilePicture: string;
  bio: string;
  instagram: string;
  twitter: string;
  facebook: string;
  concentration: string;
  classYear: string;
  createdAt: Date;
  lastLoggedIn: Date;
  level: number;
  streakDays: number;
  commentsCount: number;
  verifiedBrown: boolean;
  moderator: boolean;
}

const User = model<IUser>("User", UserSchema);
export default User;
