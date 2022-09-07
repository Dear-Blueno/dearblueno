import { Router } from "express";
import { body, param, query } from "express-validator";
import User, { INewCommentNotification, IUser } from "../models/User";
import { authCheck, modCheck } from "../middleware/auth";
import Comment, { IComment } from "../models/Comment";
import Post from "../models/Post";
import Report from "../models/Report";
import { notBanned } from "../middleware/ban";
import { validate } from "../middleware/validate";

const commentRouter = Router();

// GET request that gets 10 comments paginated in order of oldest (only comments that need review)
// (Must be authenticated as a moderator)
commentRouter.get(
  "/mod-feed/comments",
  modCheck,
  query("page").optional().isInt({ min: 1 }),
  validate,
  async (req, res) => {
    const page = Number(req.query.page) || 1;
    const comments = await Comment.find({ needsReview: true })
      .sort({ commentTime: "ascending" })
      .skip((page - 1) * 10)
      .limit(10)
      .populate("post")
      .populate({
        path: "parentComment",
        populate: {
          path: "author",
          select: "name profilePicture badges displayName pronouns",
        },
      });
    res.send(comments);
  }
);

// GET request that gets 10 reports paginated in order of oldest (only unresolved reports)
// (Must be authenticated as a moderator)
commentRouter.get(
  "/mod-feed/reports",
  modCheck,
  query("page").optional().isInt({ min: 1 }),
  validate,
  async (req, res) => {
    const page = Number(req.query.page) || 1;
    const reports = await Report.find({ resolved: false })
      .sort({ timeSubmitted: "ascending" })
      .skip((page - 1) * 10)
      .limit(10)
      .populate("post")
      .populate({
        path: "comment",
        populate: [
          {
            path: "author",
            select: "name profilePicture badges displayName pronouns",
          },
          {
            path: "parentComment",
            populate: {
              path: "author",
              select: "name profilePicture badges displayName pronouns",
            },
          },
        ],
      });
    res.send(reports);
  }
);

// POST request that creates a new comment
// (Must be authenticated)
commentRouter.post(
  "/:id/comment",
  authCheck,
  notBanned,
  body("content").isString().trim().isLength({ min: 1, max: 2000 }),
  body("parentId").isInt({ min: -1 }),
  body("anonymous").toBoolean(),
  param("id").isInt({ min: 1 }),
  validate,
  async (req, res) => {
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

      post.score += 1.5;
      post.hotScore += 1.5;

      // Send a notification to the post's subscribers (if not anonymous)
      const subscribers = post.subscribers.filter((subscriber) => {
        return subscriber._id.toString() !== user._id.toString();
      }); // remove the user from the list of subscribers
      const notification: INewCommentNotification = {
        timestamp: new Date(),
        type: "newComment",
        content: {
          postNumber: post.postNumber,
          userName: user.displayName ?? user.name,
          commentContent: req.body.content,
          profilePicture: user.profilePicture,
        },
      };
      await User.updateMany(
        { _id: { $in: subscribers } },
        {
          $push: {
            notifications: {
              $each: [notification],
              $slice: -100,
            },
          },
        }
      );

      // If the user has autoSubscribe enabled (and they aren't already subscribed), subscribe them to the post
      if (user.settings.autoSubscribe) {
        await Promise.all([
          Post.updateOne(
            { _id: post._id },
            { $addToSet: { subscribers: user._id } }
          ),
          User.updateOne(
            { _id: user._id },
            { $addToSet: { subscriptions: post._id } }
          ),
        ]);
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
commentRouter.put(
  "/:id/comment/:commentId/approve",
  modCheck,
  body("approved").toBoolean(),
  param("id").isInt({ min: 1 }),
  param("commentId").isInt({ min: 1 }),
  validate,
  async (req, res) => {
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

    if (comment.approved && !comment.author) {
      post.score += 0.75;
      post.hotScore += 0.75;

      // Send a notification to the post's subscribers
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
      await User.updateMany(
        { _id: { $in: post.subscribers } },
        {
          $push: {
            notifications: {
              $each: [notification],
              $slice: -100,
            },
          },
        }
      );
    }

    await Promise.all([post.save(), comment.save()]);

    res.send(comment);
  }
);

// PUT request that reacts to a comment
// (Must be authenticated)
commentRouter.put(
  "/:id/comment/:commentId/react",
  authCheck,
  body("reaction").isInt({ min: 1, max: 6 }),
  body("state").toBoolean(),
  param("id").isInt({ min: 1 }),
  param("commentId").isInt({ min: 1 }),
  validate,
  async (req, res) => {
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

    const reactions = comment.reactions[reaction - 1] || [];
    if (state && !reactions.includes(user._id)) {
      reactions.push(user._id);
    } else if (!state && reactions.includes(user._id)) {
      reactions.splice(reactions.indexOf(user._id), 1);
    } else {
      // The user has already reacted to the comment with the same reaction
      res.json({ reaction: req.body.state });
      return;
    }
    comment.reactions[reaction - 1] = reactions;

    const promises = [post.save(), comment.save()];

    // If the commenter is not anonymous, award / take-away some XP from the commenter
    const commenter = comment.author;
    if (commenter && reaction <= 3) {
      promises.push(
        User.updateOne({ _id: commenter }, { $inc: { xp: state ? 1 : -1 } })
      );
    }
    // Update the post score
    post.score += state ? 0.25 : -0.25;
    post.hotScore += state ? 0.25 : -0.25;

    await Promise.all(promises);

    res.json({ reaction: req.body.state });
  }
);

// DELETE request that deletes a comment
// (Must be authenticated)
commentRouter.delete(
  "/:postNumber/comment/:commentNumber",
  authCheck,
  param("postNumber").isInt({ min: 1 }),
  param("commentNumber").isInt({ min: 1 }),
  validate,
  async (req, res) => {
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

// POST request that flags a comment and submits a report
// (Must be authenticated)
commentRouter.post(
  "/:id/comment/:commentId/flag",
  authCheck,
  param("id").isInt({ min: 1 }),
  param("commentId").isInt({ min: 1 }),
  body("reason").isString().isLength({ min: 5, max: 100 }),
  validate,
  async (req, res) => {
    const post = await Post.findOne({
      postNumber: Number(req.params.id),
    }).populate("comments");
    if (!post || !post.approved) {
      res.status(404).send("Post not found");
      return;
    }

    const comment = post.comments.find(
      (c: IComment) => c.commentNumber === Number(req.params.commentId)
    );
    if (!comment || !comment.approved) {
      res.status(404).send("Comment not found");
      return;
    }

    const exists = await Report.exists({
      post: post._id,
      comment: comment._id,
    });

    if (!exists) {
      await Report.create({
        post: post._id,
        comment: comment._id,
        reason: req.body.reason,
      });
    }

    res.json({ success: true });
  }
);

// PUT request that marks a comment's report as resolved
// (Must be authenticated as moderator)
commentRouter.put(
  "/:id/comment/:commentId/resolve",
  modCheck,
  param("id").isInt({ min: 1 }),
  param("commentId").isInt({ min: 1 }),
  validate,
  async (req, res) => {
    const post = await Post.findOne({
      postNumber: req.params.id,
    }).populate("comments");
    if (!post || !post.approved) {
      res.status(404).send("Post not found");
      return;
    }

    const comment = post.comments.find(
      (c: IComment) => c.commentNumber === Number(req.params.commentId)
    );
    if (!comment || !comment.approved) {
      res.status(404).send("Comment not found");
      return;
    }

    const report = await Report.findOne({
      post: post._id,
      comment: comment._id,
    });
    if (!report) {
      res.status(404).send("Report not found");
      return;
    }

    const user = req.user as IUser;

    report.resolved = true;
    report.resolvedBy = user._id;
    await report.save();

    res.send(report);
  }
);

export default commentRouter;
