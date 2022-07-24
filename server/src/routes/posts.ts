import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import User, { INewCommentNotification, IUser } from "../models/User";
import { authCheck, modCheck, optionalAuth } from "../middleware/auth";
import Comment, { IComment } from "../models/Comment";
import Post, { IPost } from "../models/Post";
import { Document } from "mongoose";
import { notBanned } from "../middleware/ban";

const postRouter = Router();

// Cleans the sensitive data from the post object, including reactions and unapproved comments
function cleanSensitivePost(post: IPost, user?: IUser): IPost {
  const anonymizeReactionList = (reactionList: string[]) =>
    reactionList.map((reaction) =>
      String(reaction) == String(user?._id) ? reaction : "anon"
    );

  // anonymize reaction on post (replace reactor with "anon")
  const reactions = post.reactions.map(anonymizeReactionList);

  const comments = post.comments
    // don't include comments if they are not approved
    .filter((comment) => comment.approved)
    // anonymize reaction on comments (replace reactor with "anon")
    .map((comment: IComment) => {
      comment.reactions = comment.reactions.map(anonymizeReactionList);
      return comment;
    });

  return { ...post, reactions, comments };
}

// GET request that gets 10 posts paginated in order of most recent (only approved posts)
postRouter.get(
  "/",
  optionalAuth,
  query("page").optional().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page: number = Number(req.query.page) || 1;
    const posts = await Post.find({
      approved: true,
    })
      .sort({ pinned: -1, postNumber: -1 })
      .skip((page - 1) * 10)
      .limit(10)
      .select("-approvedBy -subscribers")
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name profilePicture badges",
        },
      });

    const cleanPosts = posts.map((post: IPost & Document) =>
      cleanSensitivePost(post.toObject(), req.user as IUser)
    );

    res.send(cleanPosts);
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

    const page = Number(req.query.page) || 1;
    const posts = await Post.find()
      .sort({ postTime: "descending" })
      .skip((page - 1) * 10)
      .limit(10)
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name profilePicture badges",
        },
      });
    res.send(posts);
  }
);

// GET request that gets 10 posts paginated in order of oldest (only posts that need review)
// (Must be authenticated as a moderator)
postRouter.get(
  "/mod-feed",
  modCheck,
  query("page").optional().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = Number(req.query.page) || 1;
    const posts = await Post.find({ needsReview: true })
      .sort({ postTime: "ascending" })
      .skip((page - 1) * 10)
      .limit(10);
    res.send(posts);
  }
);

// GET request that gets 10 comments paginated in order of oldest (only comments that need review)
// (Must be authenticated as a moderator)
postRouter.get(
  "/mod-feed/comments",
  modCheck,
  query("page").optional().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = Number(req.query.page) || 1;
    const comments = await Comment.find({ needsReview: true })
      .sort({ commentTime: "ascending" })
      .skip((page - 1) * 10)
      .limit(10)
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
  }
);

// GET request that searches for posts with an index query
postRouter.get(
  "/search",
  optionalAuth,
  query("query").isString().isLength({ min: 3 }).isAscii(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const searchQuery = String(req.query.query);
    const posts = await Post.find({
      approved: true,
      $text: { $search: searchQuery, $language: "en", $caseSensitive: false },
    })
      .limit(10)
      .select("-approvedBy -subscribers")
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name profilePicture badges",
        },
      });

    const cleanPosts = posts.map((post: IPost & Document) =>
      cleanSensitivePost(post.toObject(), req.user as IUser)
    );

    res.send(cleanPosts);
  }
);

// GET request that returns only the cleansed reactions of a page of posts
// (Must be authenticated)
postRouter.get(
  "/reactions",
  authCheck,
  query("page").optional().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = Number(req.query.page) || 1;
    const posts = await Post.find({
      approved: true,
    })
      .sort({ pinned: -1, postNumber: -1 })
      .skip((page - 1) * 10)
      .limit(10)
      .select("reactions comments")
      .populate({
        path: "comments",
        select: "reactions approved",
      });

    const cleanPosts = posts.map((post: IPost & Document) =>
      cleanSensitivePost(post.toObject(), req.user as IUser)
    );

    res.send(cleanPosts);
  }
);

// GET request that gets a single post by id (only approved posts)
postRouter.get(
  "/:id",
  optionalAuth,
  param("id").isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findOne({ postNumber: req.params.id })
      .select("-approvedBy -subscribers")
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name profilePicture badges",
        },
      });
    if (!post || !post.approved) {
      res.status(404).send("Post not found");
      return;
    }

    const cleanPost = cleanSensitivePost(post.toObject(), req.user as IUser);

    res.send(cleanPost);
  }
);

// POST request that creates a new post
postRouter.post(
  "/",
  optionalAuth,
  body("content").isString().trim().isLength({ min: 1, max: 5000 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const content = req.body.content;
    const user = req.user as IUser | undefined;
    const verifiedBrown = user?.verifiedBrown ?? false;
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
  body("contentWarning").trim().optional().isLength({ max: 100 }),
  param("id").isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    post.approved = req.body.approved;
    post.contentWarning = req.body.contentWarning;
    post.needsReview = false;
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
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findOne({
      postNumber: Number(req.params.id),
    }).select("-approvedBy -subscribers");
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

    res.json({ reaction: req.body.state });
  }
);

// POST request that creates a new comment
// (Must be authenticated)
postRouter.post(
  "/:id/comment",
  authCheck,
  notBanned,
  body("content").isString().trim().isLength({ min: 1, max: 2000 }),
  body("parentId").isInt({ min: -1 }),
  body("anonymous").toBoolean(),
  param("id").isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = req.user as IUser;

    const post = await Post.findOne({
      postNumber: Number(req.params.id),
    }).populate("subscribers");
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    let parentComment;
    if (req.body.parentId !== -1) {
      parentComment = await Comment.findOne({
        commentNumber: req.body.parentId,
        post: post._id,
      });
      if (!parentComment || !parentComment.approved) {
        res.status(404).send("Parent comment not found");
        return;
      }
    }

    // If the comment is not anonymous, award the user some XP
    if (!req.body.anonymous) {
      user.xp += 2;
      await User.updateOne({ _id: user._id }, { xp: user.xp });

      // Send a notification to the post's subscribers (if not anonymous)
      const subscribers = post.subscribers.filter((subscriber) => {
        return subscriber._id.toString() !== user._id.toString();
      }); // remove the user from the list of subscribers
      for (const subscriber of subscribers) {
        const notification: INewCommentNotification = {
          timestamp: new Date(),
          type: "newComment",
          content: {
            postNumber: post.postNumber,
            userName: user.name,
            commentContent: req.body.content,
            profilePicture: user.profilePicture,
          },
        };
        subscriber.notifications.push(notification);
        await subscriber.save();
      }
    }

    const comment = new Comment({
      commentNumber: post.comments.length + 1,
      parentCommentNumber: req.body.parentId,
      parentComment: parentComment?._id,
      post: post._id,
      postNumber: post.postNumber,
      content: req.body.content,
      author: req.body.anonymous ? null : user._id,
      needsReview: req.body.anonymous,
      approved: !req.body.anonymous,
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
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findOne({
      postNumber: Number(req.params.id),
    })
      .populate("comments")
      .populate("subscribers");
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const comment = post.comments.find(
      (c: IComment) => c.commentNumber === parseInt(req.params.commentId)
    );
    if (!comment) {
      res.status(404).send("Comment not found");
      return;
    }

    comment.approved = req.body.approved;
    comment.needsReview = false;
    await comment.save();
    if (comment.approved && !comment.author) {
      // Send a notification to the post's subscribers
      for (const subscriber of post.subscribers) {
        const notification: INewCommentNotification = {
          timestamp: new Date(),
          type: "newComment",
          content: {
            postNumber: post.postNumber,
            userName: "Anonymous",
            commentContent: comment.content,
            profilePicture: "",
          },
        };
        subscriber.notifications.push(notification);
        await subscriber.save();
      }
    }

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
    if (!errors.isEmpty()) {
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
      (c: IComment) => c.commentNumber === parseInt(req.params.commentId)
    );
    if (!comment) {
      res.status(404).send("Comment not found");
      return;
    }

    const reaction = req.body.reaction;
    const state = req.body.state;
    const user = req.user as IUser;

    // If the commenter is not anonymous, award / take-away some XP from the commenter
    const commenter = comment.author;
    if (commenter && reaction <= 3) {
      await User.updateOne(
        { _id: commenter },
        { $inc: { xp: state ? 1 : -1 } }
      );
    }

    const reactions = comment.reactions[reaction - 1] || [];
    if (state && !reactions.includes(user._id)) {
      reactions.push(user._id);
    } else if (reactions.includes(user._id)) {
      reactions.splice(reactions.indexOf(user._id), 1);
    }
    comment.reactions[reaction - 1] = reactions;
    await comment.save();

    res.json({ reaction: req.body.state });
  }
);

// DELETE request that deletes a comment
// (Must be authenticated)
postRouter.delete(
  "/:postNumber/comment/:commentNumber",
  authCheck,
  param("postNumber").isInt({ min: 1 }),
  param("commentNumber").isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const comment = await Comment.findOne({
      commentNumber: req.params.commentNumber,
      postNumber: req.params.postNumber,
    });
    if (!comment) {
      res.status(404).send("Comment not found");
      return;
    }

    const user = req.user as IUser;
    if (user._id.toString() !== comment.author.toString()) {
      res.status(403).send("You are not the author of this comment");
      return;
    }

    const childCommentCount = await Comment.countDocuments({
      parentComment: comment._id,
    });

    if (childCommentCount > 0) {
      // Replace the comment content with [deleted]
      comment.content = "[deleted]";
      comment.author = null;
      comment.needsReview = false;
    } else {
      // Mark the comment as unapproved and not needing review
      comment.approved = false;
      comment.needsReview = false;
    }

    await comment.save();

    // Take away previously awarded XP
    let xpDecr = -2;
    for (let i = 0; i < 3; i++) {
      xpDecr -= comment.reactions[i].length;
    }
    await User.updateOne({ _id: comment.author }, { $inc: { xp: xpDecr } });

    res.json({ success: true });
  }
);

// POST request that bookmarks a post
// (Must be authenticated)
postRouter.post(
  "/:id/bookmark",
  authCheck,
  param("id").isInt({ min: 1 }),
  body("bookmark").toBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findOne({
      postNumber: Number(req.params.id),
    });
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const user = req.user as IUser;
    const bookmarks = user.bookmarks;
    const bookmark = bookmarks.find(
      (b: IPost) => b._id.toString() === post._id.toString()
    );
    if (req.body.bookmark) {
      if (!bookmark) {
        bookmarks.push(post);
      }
    } else {
      if (bookmark) {
        bookmarks.splice(bookmarks.indexOf(bookmark), 1);
      }
    }
    user.bookmarks = bookmarks;
    await User.updateOne({ _id: user._id }, user);
    res.send(user);
  }
);

// POST request that subscribes to a post (adds the post to a user's watchlist)
// (Must be authenticated)
postRouter.post(
  "/:id/subscribe",
  authCheck,
  param("id").isInt({ min: 1 }),
  body("subscribe").toBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const post = await Post.findOne({
      postNumber: Number(req.params.id),
    });
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const user = req.user as IUser;
    const subscribers = post.subscribers;
    const subscriber = subscribers.find(
      (s: IUser) => s._id.toString() === user._id.toString()
    );
    if (req.body.subscribe) {
      if (!subscriber) {
        subscribers.push(user);
        user.subscriptions.push(post);
      }
    } else {
      if (subscriber) {
        subscribers.splice(subscribers.indexOf(subscriber), 1);
        user.subscriptions.splice(user.subscriptions.indexOf(post), 1);
      }
    }
    post.subscribers = subscribers;
    await post.save();
    await User.updateOne({ _id: user._id }, user);

    res.json({
      subscribed: req.body.subscribe,
    });
  }
);

export default postRouter;
