import { Router } from "express";
import passport from "passport";

const authRouter = Router();

// Login success
authRouter.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.user,
      cookies: req.cookies,
    });
  } else {
    // The user is not logged in
    res.redirect("/auth/login/failed");
  }
});

// Login failed
authRouter.get("/login/failed", (_req, res) => {
  res.status(401).json({
    success: false,
    message: "Login failed",
  });
});

// Logout
authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login/failed");
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
    failureRedirect: "/auth/login/failed",
    successRedirect: "/auth/login/success",
  })
);

// Return user info
authRouter.get("/", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "User logged in",
      user: req.user,
    });
  } else {
    // The user is not logged in
    res.status(401).json({
      success: false,
      message: "User not logged in",
    });
  }
});

export default authRouter;
