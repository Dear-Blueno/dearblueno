import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { authCheck, modCheck } from "../middleware/auth";
import User, { IUser } from "../models/User";

const userRouter = Router();

// GET request that searches for users by name
userRouter.get(
  "/search",
  query("name")
    .isString()
    .isLength({ min: 3 })
    .isAlpha(undefined, { ignore: " '-,." }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.query) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Search for users by name, case insensitive, and return the first 5 results
    // Remove sensitive information from the response
    const users = await User.find({
      name: { $regex: req.query.name, $options: "i" },
    })
      .limit(5)
      .select("-email -lastLoggedIn -moderator -bannedUntil");

    if (!users || users.length === 0) {
      res.status(404).send("No users found");
      return;
    }

    // Send non sensitive user data
    res.send(users);
  }
);

// GET request that gets a user by id
userRouter.get("/:id", param("id").isInt({ min: 1 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.params) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // Get user by id, remove sensitive information from the response
  const user = await User.findOne({ googleId: req.params.id }).select(
    "-email -lastLoggedIn -moderator -bannedUntil"
  );
  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  // Send non sensitive user data
  res.send(user);
});

// PUT request that updates a user's bio profile
// (Auth required)
userRouter.put(
  "/profile",
  authCheck,
  body("bio").optional().isString(),
  body("instagram")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["instagram.com"],
    }),
  body("twitter")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["twitter.com"],
    }),
  body("facebook")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["facebook.com"],
    }),
  body("concentration").optional().isString(),
  body("classYear").optional().isInt({ min: 1900, max: 2100 }), // what about .5'ers?
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = req.user as IUser;
    const { bio, instagram, twitter, facebook, concentration, classYear } =
      req.body;

    bio && (user.bio = bio);
    instagram && (user.instagram = instagram);
    twitter && (user.twitter = twitter);
    facebook && (user.facebook = facebook);
    concentration && (user.concentration = concentration);
    classYear && (user.classYear = classYear);

    const newUser = await User.findOneAndUpdate(
      { googleId: user.googleId },
      user,
      { new: true }
    );

    res.send(newUser);
  }
);

// PUT request that updates a user's profile picture
// (Auth required)
userRouter.put(
  "/profilePicture",
  authCheck,
  body("profilePicture").isURL({
    require_protocol: true,
    protocols: ["https"],
    host_whitelist: ["i.imgur.com"],
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    // Check if the url is a valid imgur url to an image
    const profilePicture = req.body.profilePicture as string;
    const urlRegex = /^https:\/\/i\.imgur\.com\/[a-zA-Z0-9]{5,7}\.png$/;
    if (!urlRegex.test(profilePicture)) {
      res.status(400).send("Invalid profile picture url");
      return;
    }

    const user = req.user as IUser;
    user.profilePicture = profilePicture;

    const newUser = await User.findOneAndUpdate(
      { googleId: user.googleId },
      user,
      { new: true }
    );

    res.send(newUser);
  }
);

// POST request that temporarily bans a user
// (Auth as moderator required)
userRouter.post(
  "/ban",
  modCheck,
  body("id").isInt({ min: 1 }),
  body("duration").isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = await User.findOne({ googleId: req.body.id });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    user.bannedUntil = new Date(Date.now() + req.body.duration * 1000 * 60); // minutes to milliseconds
    const updatedUser = await user.save();

    res.send(updatedUser);
  }
);

export default userRouter;
