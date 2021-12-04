import { Router } from "express";
import passport from "passport";

const authRouter = Router();

// Return user info
authRouter.get("/", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.user,
      cookies: req.cookies,
    });
  } else {
    // The user is not logged in
    res.status(401).json({
      success: false,
      message: "Not logged in",
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
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: process.env.CLIENT_URL,
    failureFlash: true,
  })
);

export default authRouter;
