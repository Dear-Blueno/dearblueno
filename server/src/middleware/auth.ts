import { NextFunction, Request, Response } from "express";

// check if user is authenticated
export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).send("You are not logged in");
    return;
  }
  next();
};

// check if user is a moderator
export const moderatorCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: any = req.user;
  if (!user || !user.moderator) {
    res.status(401).send("You are not a moderator");
    return;
  }
  next();
};
