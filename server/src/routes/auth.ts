import { Router } from "express";
import passport from "passport";
import User, { IUser } from "../models/User";

const authRouter = Router();

// Return user info
authRouter.get("/", async (req, res) => {
  if (req.user) {
    res.status(200).json({
      loggedIn: true,
      user: req.user,
    });
    await User.updateOne(
      { _id: (req.user as IUser)._id },
      { lastLoggedIn: Date.now() }
    );
  } else {
    // The user is not logged in
    res.status(204).send();
  }
});

// Logout
authRouter.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.CLIENT_URL ?? "http://localhost:3000");
  });
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
authRouter.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err) => {
    const url = process.env.CLIENT_URL ?? "http://localhost:3000";
    if (err) {
      return res.redirect(`${url}/login-error`);
    }
    return res.redirect(url);
  })(req, res, next);
});

export default authRouter;
