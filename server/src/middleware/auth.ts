import { NextFunction, Request, Response } from "express";
import { IUser } from "src/models/User";

// check if user is authenticated
export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  // If in testing mode, get user from req.body
  if (process.env.NODE_ENV === "test") {
    req.user = req.body.user;
  }

  if (!req.user) {
    res.status(401).send("You are not logged in");
    return;
  }
  next();
};

// check if user is a moderator
export const modCheck = (req: Request, res: Response, next: NextFunction) => {
  // If in testing mode, get user from req.body
  if (process.env.NODE_ENV === "test") {
    req.user = req.body.user;
  }

  const user = req.user as IUser;
  if (!user || !user.moderator) {
    res.status(401).send("You are not a moderator");
    return;
  }
  next();
};

// check if user is a verified Brown University community member
export const brownCheck = (req: Request, res: Response, next: NextFunction) => {
  // If in testing mode, get user from req.body
  if (process.env.NODE_ENV === "test") {
    req.user = req.body.user;
  }

  const user = req.user as IUser;
  if (!user || !user.verifiedBrown) {
    res.status(401).send("You are not a verified Brown University member");
    return;
  }
  next();
};
