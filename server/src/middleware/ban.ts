import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";

export const notBanned = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the user is banned
  const reqUser = req.user as IUser;
  const user = await User.findById(reqUser._id);

  if (!user) {
    res.status(403).send("User not found");
    return;
  }

  if (user.bannedUntil && user.bannedUntil > new Date()) {
    res
      .status(403)
      .send(
        `User is banned until ${new Date(
          user.bannedUntil
        ).toLocaleDateString()}`
      );
    return;
  }

  next();
};
