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
    .isLength({ min: 3, max: 20 })
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
userRouter.get("/:id", param("id").isMongoId(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.params) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // Get user by id, remove sensitive information from the response
  const user = await User.findById(req.params.id).select(
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
  body("bio").optional().isLength({ max: 300 }),
  body("instagram")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["instagram.com"],
    })
    .isLength({ max: 200 }),
  body("twitter")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["twitter.com"],
    })
    .isLength({ max: 200 }),
  body("facebook")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["facebook.com"],
    })
    .isLength({ max: 200 }),
  body("concentration").optional().isString().isLength({ max: 100 }),
  body("classYear")
    .optional()
    .isFloat({
      min: 1950,
      max: new Date().getFullYear() + 8,
    })
    .custom((value) => {
      return (value * 2) % 1 === 0;
    })
    .isLength({ min: 4, max: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = req.user as IUser;
    const { bio, instagram, twitter, facebook, concentration, classYear } =
      req.body;

    user.bio = bio;
    user.instagram = instagram;
    user.twitter = twitter;
    user.facebook = facebook;
    user.concentration = concentration;
    user.classYear = classYear;

    const newUser = await User.findByIdAndUpdate(user._id, user, { new: true });

    res.send(newUser);
  }
);

// PUT request that updates a user's profile picture
// (Auth required)
userRouter.put(
  "/profilePicture",
  authCheck,
  body("profilePicture")
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["i.imgur.com"],
    })
    .isLength({ max: 200 }),
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

    const newUser = await User.findByIdAndUpdate(user._id, user, { new: true });

    res.send(newUser);
  }
);

// POST request that temporarily bans a user
// (Auth as moderator required)
userRouter.post(
  "/ban",
  modCheck,
  body("id").isMongoId(),
  body("duration").isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = await User.findById(req.body.id);
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
