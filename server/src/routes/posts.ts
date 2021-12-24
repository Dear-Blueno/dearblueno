import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import User, { IUser } from "../models/User";
import { authCheck, modCheck, optionalAuth } from "../middleware/auth";
import Comment, { IComment } from "../models/Comment";
import Post from "../models/Post";

const postRouter = Router();

// GET request that gets 10 posts paginated in order of most recent (only approved posts)
postRouter.get(
  "/",
  query("page").optional().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = req.query?.page || 1;
    const posts = await Post.find({ approved: true })
      .sort({ postNumber: "descending" })
      .skip((page - 1) * 10)
      .limit(10)
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name profilePicture",
        },
      });

    // don't include comments if they are not approved
    posts.forEach((post) => {
      post.comments = post.comments.filter((comment) => comment.approved);
    });

    res.send(posts);
  }
);

// GET request that gets 10 posts paginated in order of most recent (all posts)
// (Must be authenticated as a moderator)
postRouter.get(
  "/all",
  modCheck,
  query("page").optional().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = Number(req.query?.page) || 1;
    const posts = await Post.find()
      .sort({ postNumber: "descending" })
      .skip((page - 1) * 10)
      .limit(10)
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name profilePicture googleId",
        },
      });
    res.send(posts);
  }
);

// GET request that gets a single post by id (only approved posts)
postRouter.get("/:id", param("id").isInt({ min: 1 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.params) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const post = await Post.findOne({ postNumber: req.params.id })
    .populate("comments")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "name profilePicture googleId",
      },
    });
  if (!post || !post.approved) {
    res.status(404).send("Post not found");
    return;
  }

  // don't include comments if they are not approved
  post.comments = post.comments.filter((comment) => comment.approved);

  res.send(post);
});

// POST request that creates a new post
postRouter.post(
  "/",
  optionalAuth,
  body("content").trim().isLength({ min: 1, max: 5000 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const content = req.body.content;
    const user = req.user as IUser | undefined;
    const verifiedBrown = user?.verifiedBrown || false;
    const post = new Post({
      content,
      verifiedBrown,
    });
    await post.save();
    res.send(post);
  }
);

// PUT request that changes a post's approved status
// (Must be authenticated as a moderator)
postRouter.put(
  "/:id/approve",
  modCheck,
  body("approved").toBoolean(),
  param("id").isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    post.approved = req.body.approved;
    post.approvedTime = new Date();
    post.approvedBy = (req.user as IUser)._id;
    if (!post.postNumber && post.approved) {
      post.postNumber =
        (await Post.countDocuments({
          postNumber: { $exists: true },
        })) + 1;
    }
    await post.save();
    res.send(post);
  }
);

// PUT request that reacts to a post
// (Must be authenticated)
postRouter.put(
  "/:id/react",
  authCheck,
  body("reaction").isInt({ min: 1, max: 6 }),
  body("state").toBoolean(),
  param("id").isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findOne({ postNumber: Number(req.params.id) });
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const reaction = req.body.reaction;
    const state = req.body.state;
    const user = req.user as IUser;

    const reactions = post.reactions[reaction - 1] || [];
    if (state) {
      !reactions.includes(user._id) && reactions.push(user._id);
    } else {
      reactions.includes(user._id) &&
        reactions.splice(reactions.indexOf(user._id), 1);
    }
    post.reactions[reaction - 1] = reactions;
    await post.save();
    res.send(post);
  }
);

// POST request that creates a new comment
// (Must be authenticated)
postRouter.post(
  "/:id/comment",
  authCheck,
  body("content").trim().isLength({ min: 1, max: 2000 }).isAscii(),
  body("parentId").isInt({ min: -1 }),
  param("id").isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const reqUser = req.user as IUser;
    const user = await User.findById(reqUser._id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    // Check if the user is banned
    if (user.bannedUntil && user.bannedUntil > new Date()) {
      res
        .status(403)
        .send(
          `User is banned until ${new Date(
            user.bannedUntil
          ).toLocaleDateString()}`
        );
      return;
    }

    const post = await Post.findOne({ postNumber: Number(req.params.id) });
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const comment = new Comment({
      commentNumber: post.comments.length + 1,
      parentCommentNumber: req.body.parentId,
      post: post._id,
      postNumber: post.postNumber,
      content: req.body.content,
      author: user._id,
    });
    await comment.save();
    post.comments.push(comment);
    await post.save();
    res.send(comment);
  }
);

// PUT request that changes a comment's approved status
// (Must be authenticated as a moderator)
postRouter.put(
  "/:id/comment/:commentId/approve",
  modCheck,
  body("approved").toBoolean(),
  param("id").isInt({ min: 1 }),
  param("commentId").isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findOne({
      postNumber: Number(req.params.id),
    }).populate("comments");
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const comment = post.comments.find(
      (c: IComment) => c.commentNumber === parseInt(req.params?.commentId)
    );
    if (!comment) {
      res.status(404).send("Comment not found");
      return;
    }

    comment.approved = req.body.approved;
    await comment.save();
    res.send(comment);
  }
);

// PUT request that reacts to a comment
// (Must be authenticated)
postRouter.put(
  "/:id/comment/:commentId/react",
  authCheck,
  body("reaction").isInt({ min: 1, max: 6 }),
  body("state").toBoolean(),
  param("id").isInt({ min: 1 }),
  param("commentId").isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findOne({
      postNumber: Number(req.params.id),
    }).populate("comments");
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const comment = post.comments.find(
      (c: IComment) => c.commentNumber === parseInt(req.params?.commentId)
    );
    if (!comment) {
      res.status(404).send("Comment not found");
      return;
    }

    const reaction = req.body.reaction;
    const state = req.body.state;
    const user = req.user as IUser;

    const reactions = comment.reactions[reaction - 1] || [];
    if (state) {
      !reactions.includes(user._id) && reactions.push(user._id);
    } else {
      reactions.includes(user._id) &&
        reactions.splice(reactions.indexOf(user._id), 1);
    }
    comment.reactions[reaction - 1] = reactions;
    await comment.save();
    res.send(comment);
  }
);

export default postRouter;
