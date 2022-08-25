import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/User";

// handle optional auth
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // If in testing mode, get user from req.body
  if (process.env.NODE_ENV === "test") {
    req.user = req.body.user;
  }

  next();
};

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

  const user = req.user as IUser | undefined;
  if (!user || !user.moderator) {
    res.status(401).send("You are not a moderator");
    return;
  }
  next();
};
