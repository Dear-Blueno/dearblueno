import { Router } from "express";
import { body, param, query } from "express-validator";
import User, { IUser } from "../models/User";
import { authCheck, modCheck, optionalAuth } from "../middleware/auth";
import Post, { IPost } from "../models/Post";
import { Document, SortOrder } from "mongoose";
import { validate } from "../middleware/validate";
import cleanSensitivePost from "../config/cleanSensitivePost";

const postRouter = Router();

// GET request that gets 10 posts paginated in order of most recent (only approved posts)
postRouter.get(
  "/",
  optionalAuth,
  query("page").default(1).isInt({ min: 1 }),
  query("sort")
    .default("default")
    .isIn(["new", "topWeek", "topMonth", "topAllTime", "hot", "default"]),
  validate,
  async (req, res) => {
    type Sort = "new" | "topWeek" | "topMonth" | "topAllTime" | "hot";

    const user = req.user as IUser | undefined;
    const page = Number(req.query.page);
    const sort = (
      req.query.sort !== "default"
        ? req.query.sort
        : user
        ? user.settings.homeFeedSort
        : "hot"
    ) as Sort;

    const sortOptions: { [key in Sort]: Record<string, SortOrder> } = {
      new: { pinned: -1, postNumber: -1 },
      topWeek: { pinned: -1, score: -1, postNumber: -1 },
      topMonth: { pinned: -1, score: -1, postNumber: -1 },
      topAllTime: { pinned: -1, score: -1, postNumber: -1 },
      hot: { pinned: -1, hotScore: -1, postNumber: -1 },
    };
    const sortQuery = sortOptions[sort];
    const filterOptions = {
      new: { approved: true },
      topWeek: {
        approved: true,
        approvedTime: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
      },
      topMonth: {
        approved: true,
        approvedTime: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) },
      },
      topAllTime: { approved: true },
      hot: {
        approved: true,
        approvedTime: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
      },
    };
    const filterQuery = filterOptions[sort];

    let posts = await Post.find(filterQuery)
      .sort(sortQuery)
      .skip((page - 1) * 10)
      .limit(10)
      .select("-approvedBy -subscribers -score -hotScore")
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name profilePicture badges displayName pronouns",
        },
      });

    // If reached the end of the hot feed, switch to the new feed
    if (sort === "hot" && posts.length !== 10) {
      posts = posts.concat(
        await Post.find(filterOptions.new)
          .sort(sortOptions.new)
          .skip((page - 1) * 10 + posts.length)
          .limit(10 - posts.length)
          .select("-approvedBy -subscribers -score -hotScore")
          .populate("comments")
          .populate({
            path: "comments",
            populate: {
              path: "author",
              select: "name profilePicture badges displayName pronouns",
            },
          })
      );
    }

    const cleanPosts = posts.map((post) =>
      cleanSensitivePost(post.toObject(), user)
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
  validate,
  async (req, res) => {
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
          select: "name profilePicture badges displayName pronouns",
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
  validate,
  async (req, res) => {
    const page = Number(req.query.page) || 1;
    const posts = await Post.find({ needsReview: true })
      .sort({ postTime: "ascending" })
      .skip((page - 1) * 10)
      .limit(10);
    res.send(posts);
  }
);

// GET request that searches for posts with an index query
postRouter.get(
  "/search",
  optionalAuth,
  query("query").isString().isLength({ min: 3 }).isAscii(),
  validate,
  async (req, res) => {
    const searchQuery = String(req.query.query);
    const posts = await Post.find({
      approved: true,
      $text: { $search: searchQuery, $language: "en", $caseSensitive: false },
    })
      .limit(10)
      .select("-approvedBy -subscribers -score -hotScore")
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name profilePicture badges displayName pronouns",
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
  validate,
  async (req, res) => {
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
  validate,
  async (req, res) => {
    const post = await Post.findOne({ postNumber: req.params.id })
      .select("-approvedBy -subscribers -score -hotScore")
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name profilePicture badges displayName pronouns",
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

// GET request that gets only the cleansed reactions of a single post
// (Must be authenticated)
postRouter.get(
  "/:id/reactions",
  authCheck,
  param("id").isInt({ min: 1 }),
  validate,
  async (req, res) => {
    const post = await Post.findOne({ postNumber: req.params.id })
      .select("reactions comments approved")
      .populate({
        path: "comments",
        select: "reactions approved",
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
  validate,
  async (req, res) => {
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

// POST request that creates a new image post
postRouter.post(
  "/image",
  authCheck,
  body("title").isString().trim().isLength({ min: 1, max: 100 }),
  body("imageUrl")
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["i.imgur.com"],
    })
    .isLength({ max: 200 }),
  validate,
  async (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;

    const user = req.user as IUser;
    const verifiedBrown = user.verifiedBrown;

    const post = new Post({
      content: title,
      imageUrl,
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
  validate,
  async (req, res) => {
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
  validate,
  async (req, res) => {
    const post = await Post.findOne({
      postNumber: Number(req.params.id),
    });
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const reaction = req.body.reaction;
    const state = req.body.state;
    const user = req.user as IUser;

    const reactions = post.reactions[reaction - 1] || [];
    if (state && !reactions.includes(user._id)) {
      reactions.push(user._id);
      post.score += 3;
      post.hotScore += 3;
    } else if (!state && reactions.includes(user._id)) {
      reactions.splice(reactions.indexOf(user._id), 1);
      post.score -= 3;
      post.hotScore -= 3;
    } else {
      // Reaction state did not change
      res.json({ reaction: req.body.state });
      return;
    }
    post.reactions[reaction - 1] = reactions;
    await post.save();

    res.json({ reaction: req.body.state });
  }
);

// POST request that bookmarks a post
// (Must be authenticated)
postRouter.post(
  "/:id/bookmark",
  authCheck,
  param("id").isInt({ min: 1 }),
  body("bookmark").toBoolean(),
  validate,
  async (req, res) => {
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
  validate,
  async (req, res) => {
    const post = await Post.findOne({
      postNumber: Number(req.params.id),
    });
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const user = req.user as IUser;

    if (req.body.subscribe) {
      await Promise.all([
        User.updateOne(
          { _id: user._id },
          { $addToSet: { subscriptions: post._id } }
        ),
        Post.updateOne(
          { _id: post._id },
          { $addToSet: { subscribers: user._id } }
        ),
      ]);
    } else {
      await Promise.all([
        User.updateOne(
          { _id: user._id },
          { $pull: { subscriptions: post._id } }
        ),
        Post.updateOne({ _id: post._id }, { $pull: { subscribers: user._id } }),
      ]);
    }

    res.json({
      subscribed: req.body.subscribe,
    });
  }
);

export default postRouter;
