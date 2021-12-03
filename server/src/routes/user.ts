import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import User, { IUser } from "../models/User";

const userRouter = Router();

// GET request that gets a user by id
userRouter.get("/:id", param("id").isInt({ min: 1 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.params) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const user = await User.findOne({ googleId: req.params.id });
  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  // Send non sensitive user data
  res.json({
    user: {
      googleId: user.googleId,
      name: user.name,
      profilePicture: user.profilePicture,
      bio: user.bio,
      instagram: user.instagram,
      twitter: user.twitter,
      facebook: user.facebook,
      concentration: user.concentration,
      createdAt: user.createdAt,
      xp: user.xp,
      classYear: user.classYear,
      streakDays: user.streakDays,
      verifiedBrown: user.verifiedBrown,
      badges: user.badges,
    },
  });
});

// GET request that searches for users by name
userRouter.get(
  "/search/:name",
  param("name").isString().isLength({ min: 2 }).isAlpha(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const users = await User.find({ name: { $regex: req.params.name } });
    if (!users) {
      res.status(404).send("No users found");
      return;
    }

    // Send non sensitive user data
    res.json({
      users: users.map((user) => {
        return {
          googleId: user.googleId,
          name: user.name,
          profilePicture: user.profilePicture,
          bio: user.bio,
          instagram: user.instagram,
          twitter: user.twitter,
          facebook: user.facebook,
          concentration: user.concentration,
          createdAt: user.createdAt,
          xp: user.xp,
          classYear: user.classYear,
          streakDays: user.streakDays,
          verifiedBrown: user.verifiedBrown,
          badges: user.badges,
        };
      }),
    });
  }
);

// PUT request that updates a user's bio profile
userRouter.put(
  "/profile",
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

    res.json({ user: newUser });
  }
);

// PUT request that updates a user's profile picture
userRouter.put(
  "/profilePicture",
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

    const user = req.user as IUser;
    const { profilePicture } = req.body;

    profilePicture && (user.profilePicture = profilePicture);

    const newUser = await User.findOneAndUpdate(
      { googleId: user.googleId },
      user,
      { new: true }
    );

    res.json({ user: newUser });
  }
);

// TODO: Add routes here

export default userRouter;
