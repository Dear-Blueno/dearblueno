import { Router } from "express";
import passport from "passport";
import User, { IUser } from "../models/User";

const authRouter = Router();

// Return user info
authRouter.get("/", async (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      user: req.user,
    });
    const user = await User.findByIdAndUpdate(
      (req.user as IUser)._id,
      {
        lastLoggedIn: Date.now(),
      },
      { new: true }
    );
    if (user) {
      (req.session as any).passport.user = user;
      req.session.save();
    }
  } else {
    // The user is not logged in
    res.status(401).json({
      success: false,
    });
  }
});

// Logout
authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL || "http://localhost:3000");
});

// Google OAuth2 - Verified Brown users only
authRouter.get(
  "/login",
  passport.authenticate("google", {
    hd: "brown.edu", // Only allow Brown users
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google OAuth2 - Unverified
authRouter.get(
  "/login/unverified",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google OAuth2 callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL || "http://localhost:3000",
    failureRedirect: "/auth/login/unverified",
  })
);

export default authRouter;
