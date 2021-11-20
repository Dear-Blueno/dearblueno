import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import Comment, { IComment } from "../models/Comment";
import Post from "../models/Post";

const postRouter = Router();

// GET request that gets 10 posts paginated in order of most recent (only approved posts)
postRouter.get("/", body("page").isInt({ min: 1 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const page = req.body.page || 1;
  const posts = await Post.find({ approved: true })
    .sort({ createdAt: -1 })
    .skip((page - 1) * 10)
    .limit(10)
    .populate("comments")
    .populate("comments.author");

  // don't include comments if they are not approved
  posts.forEach((post) => {
    post.comments = post.comments.filter((comment) => comment.approved);
  });

  res.send(posts);
});

// GET request that gets 10 posts paginated in order of most recent (all posts)
// (Must be authenticated as a moderator)
postRouter.get(
  "/all",
  // moderatorCheck, // TODO: uncomment when authentication is implemented
  body("page").isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = req.body.page || 1;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * 10)
      .limit(10)
      .populate("comments")
      .populate("comments.author");
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
    .populate("comments.author");
  if (!post || !post.approved) {
    res.status(404).send("Post not found");
    return;
  }

  // don't include comments if they are not approved
  post.comments = post.comments.filter((comment) => comment.approved);

  res.send(post);
});

// POST request that creates a new post
// (Must be authenticated)
postRouter.post(
  "/",
  // authCheck, // TODO: uncomment when auth is implemented
  body("content").trim().isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const content = req.body.content;
    const post = new Post({
      content,
    });
    await post.save();
    res.send(post);
  }
);

// PUT request that changes a post's approved status
// (Must be authenticated as a moderator)
postRouter.put(
  "/:id/approve",
  // moderatorCheck, // TODO: uncomment when auth is implemented
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
    // post.approvedBy = (req.user as any)._id; // TODO: uncomment when auth is implemented
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
  // authCheck, // TODO: uncomment when auth is implemented
  body("reaction").isInt({ min: 1, max: 6 }),
  body("state").toBoolean(),
  param("id").isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findOne({ postNumber: req.params.id });
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const reaction = req.body.reaction;
    const state = req.body.state;
    const user = (req.user as any) || { _id: "5f3f8f9f8d8f8e0f8b8b8b8b" }; // TODO: simplify when auth is implemented

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
  // authCheck, // TODO: uncomment when auth is implemented
  body("content").trim().isLength({ min: 1 }),
  body("parentId").isInt({ min: -1 }),
  param("id").isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findOne({ postNumber: req.params.id });
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }
    const user = (req.user as any) || { _id: "5f3f8f9f8d8f8e0f8b8b8b8b" }; // TODO: simplify when auth is implemented

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
  // moderatorCheck, // TODO: uncomment when auth is implemented
  body("approved").toBoolean(),
  param("id").isInt({ min: 1 }),
  param("commentId").isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.params) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findOne({ postNumber: req.params.id }).populate(
      "comments"
    );
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
  // authCheck, // TODO: uncomment when auth is implemented
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

    const post = await Post.findOne({ postNumber: req.params.id }).populate(
      "comments"
    );
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
    const user = (req.user as any) || { _id: "5f3f8f9f8d8f8e0f8b8b8b8b" }; // TODO: simplify when auth is implemented

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
