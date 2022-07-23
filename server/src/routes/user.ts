import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import Comment from "../models/Comment";
import { authCheck, modCheck } from "../middleware/auth";
import User, { IUser } from "../models/User";
import Post from "../models/Post";

const userRouter = Router();

// GET request that returns a list of posts that the user has bookmarked
// (Must be authenticated)
userRouter.get(
  "/bookmarks",
  authCheck,
  query("page").optional().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = req.user as IUser;
    const bookmarks = user.bookmarks;
    const page = Number(req.query.page) || 1;

    // Should only return posts that are approved
    const posts = await Post.find({ _id: { $in: bookmarks }, approved: true })
      .skip((page - 1) * 10)
      .limit(10)
      .select("-approvedBy -subscribers")
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name profilePicture",
        },
      });

    res.send(posts);
  }
);

// DELETE request that deletes a notification
// (Must be authenticated)
userRouter.delete(
  "/notifications/:notificationId",
  authCheck,
  param("notificationId").isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = req.user as IUser;
    const notificationId = req.params.notificationId;

    // Delete the notification in the user's notifications
    const index = user.notifications.findIndex(
      (notification) => notification._id == notificationId
    );
    if (index === -1) {
      res.status(404).send("Notification not found");
      return;
    }

    user.notifications.splice(index, 1);
    await User.updateOne(
      { _id: user._id },
      { notifications: user.notifications }
    );

    res.send(user);
  }
);

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
      .select(
        "-email -lastLoggedIn -moderator -bannedUntil -bookmarks -notifications -subscriptions"
      );

    if (users.length === 0) {
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
    "-email -lastLoggedIn -moderator -bannedUntil -bookmarks -notifications -subscriptions"
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
  body("hometown").optional().isLength({ max: 100 }),
  body("instagram")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["instagram.com", "www.instagram.com"],
    })
    .isLength({ max: 200 }),
  body("twitter")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["twitter.com", "www.twitter.com"],
    })
    .isLength({ max: 200 }),
  body("facebook")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["facebook.com", "www.facebook.com"],
    })
    .isLength({ max: 200 }),
  body("linkedin")
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["linkedin.com", "www.linkedin.com"],
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
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = req.user as IUser;
    const {
      bio,
      hometown,
      instagram,
      twitter,
      facebook,
      linkedin,
      concentration,
      classYear,
    } = req.body;

    const newUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          bio: bio || null,
          hometown: hometown || null,
          instagram: instagram || null,
          twitter: twitter || null,
          facebook: facebook || null,
          linkedin: linkedin || null,
          concentration: concentration || null,
          classYear: classYear || null,
        },
      },
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
  body("profilePicture")
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["i.imgur.com"],
    })
    .isLength({ max: 200 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    // Check if the url is a valid imgur url to an image
    const profilePicture = req.body.profilePicture as string;
    const urlRegex =
      /^https:\/\/i\.imgur\.com\/[a-zA-Z0-9]{5,7}\.(?:png|jpg|jpeg)$/;
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

// GET request that gets all the comments made by a user
userRouter.get("/:id/comments", param("id").isMongoId(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.params) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  const comments = await Comment.find({ author: user._id, approved: true })
    .populate({
      path: "author",
      select: "name profilePicture badges",
    })
    .populate("post")
    .populate({
      path: "parentComment",
      populate: {
        path: "author",
        select: "name profilePicture badges",
      },
    });

  res.send(comments);
});

export default userRouter;
