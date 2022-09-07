import { Express } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Post from "../../models/Post";
import Comment from "../../models/Comment";
import Report, { IReport } from "../../models/Report";
import User, { INewCommentNotification, IUser } from "../../models/User";
import request from "supertest";
import setupForTests from "../testUtil";

describe("Comments", () => {
  let mongo: MongoMemoryServer;
  let app: Express;
  let user: IUser;
  let modUser: IUser;

  beforeAll(async () => {
    const { server, db } = await setupForTests();
    app = server;
    mongo = db;
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();

    const userModel = new User({
      googleId: "123",
      name: "Bob",
      givenName: "Bob",
      email: "bob@dearblueno.net",
      profilePicture: "https://i.imgur.com/2j1RdhZ.png",
      verifiedBrown: false,
    });
    user = await userModel.save();

    const modUserModel = new User({
      googleId: "456",
      name: "Mod",
      givenName: "Mod",
      email: "mod@dearblueno.net",
      profilePicture: "https://i.imgur.com/2j1RdhZ.png",
      moderator: true,
      verifiedBrown: true,
    });
    modUser = await modUserModel.save();
  });

  describe("GET /posts/mod-feed/comments", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).get("/posts/mod-feed/comments").expect(401);
    });

    it("should return 401 if not a mod", async () => {
      await request(app)
        .get("/posts/mod-feed/comments")
        .send({ user })
        .expect(401);
    });

    it("should return an array of needs review comments if logged in as a mod", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        needsReview: false,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        post: post._id,
        postNumber: 1,
        commentNumber: 1,
        approved: false,
        needsReview: true,
      });
      await comment.save();

      const comment2 = new Comment({
        content: "This is another test comment",
        post: post._id,
        postNumber: 1,
        commentNumber: 2,
        approved: true,
        needsReview: false,
      });
      await comment2.save();

      post.comments.push(comment);
      post.comments.push(comment2);
      await post.save();

      const res = await request(app)
        .get("/posts/mod-feed/comments")
        .send({ user: modUser })
        .expect(200);
      expect(res.body).toHaveLength(1);

      expect(res.body[0].content).toBe("This is a test comment");
      expect(res.body[0].postNumber).toBe(1);
      expect(res.body[0].commentNumber).toBe(1);
      expect(res.body[0].approved).toBe(false);
    });
  });

  describe("POST /posts/:id/comment", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).post("/posts/1/comment").expect(401);
    });

    it("should return 404 if the post does not exist", async () => {
      await request(app)
        .post("/posts/1/comment")
        .send({ user, content: "Hi", parentId: -1 })
        .expect(404);
    });

    it("should return 400 if comment not included in body", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app).post(`/posts/1/comment`).send({ user }).expect(400);

      const post2 = await Post.findOne();
      expect(post2?.comments).toHaveLength(0);
    });

    it("should return 200 if logged in and the post exists and the comment is valid", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app)
        .post(`/posts/1/comment`)
        .send({ user, content: "This is a test comment", parentId: -1 })
        .expect(200);

      const post2 = await Post.findOne().populate("comments");
      expect(post2?.comments).toHaveLength(1);
      expect(post2?.score).toBe(1.5);
      expect(post2?.hotScore).toBe(1.5);
      const comment = post2?.comments[0];
      expect(comment?.content).toBe("This is a test comment");
      expect(comment?.author).toStrictEqual(user._id);
      expect(comment?.commentTime).toBeDefined();
      expect(comment?.approved).toBe(true);
      expect(comment?.needsReview).toBe(false);
      expect(comment?.postNumber).toBe(1);
      expect(comment?.commentNumber).toBe(1);
      expect(comment?.parentCommentNumber).toBe(-1);
      expect(comment?.post).toStrictEqual(post._id);

      const commenter = await User.findById(user._id);
      expect(commenter?.xp).toBe(2);
    });

    it("should be able to post anonymous comment", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app)
        .post(`/posts/1/comment`)
        .send({
          user,
          content: "This is a test comment",
          parentId: -1,
          anonymous: true,
        })
        .expect(200);

      const post2 = await Post.findOne().populate("comments");
      expect(post2?.comments).toHaveLength(1);
      const comment = post2?.comments[0];
      expect(comment?.content).toBe("This is a test comment");
      expect(comment?.author).toBe(null);
      expect(comment?.commentTime).toBeDefined();
      expect(comment?.approved).toBe(false);
      expect(comment?.needsReview).toBe(true);
      expect(comment?.postNumber).toBe(1);
      expect(comment?.commentNumber).toBe(1);
      expect(comment?.parentCommentNumber).toBe(-1);
      expect(comment?.post).toStrictEqual(post._id);
    });

    it("should not be able to post comment if banned", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const bannedUser = new User({
        googleId: "12345",
        name: "Banned User",
        email: "banned@dearblueno.net",
        profilePicture: "https://i.imgur.com/removed.png",
        bannedUntil: new Date(Date.now() + 100000),
      });
      await bannedUser.save();

      await request(app)
        .post(`/posts/1/comment`)
        .send({
          user: bannedUser,
          content: "This is a test comment",
          parentId: -1,
        })
        .expect(403);
    });

    it("should not be able to post comment in reply to unapproved comment", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        approved: false,
        commentNumber: 1,
        post: post._id,
        parentCommentNumber: -1,
        postNumber: 1,
      });
      await comment.save();

      await request(app)
        .post(`/posts/1/comment`)
        .send({ user, content: "This is a test comment!!", parentId: 1 })
        .expect(404);
    });

    it("should send notifications to users subscribed to the post", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
        subscribers: [user._id, modUser._id],
      });
      await post.save();

      await request(app)
        .post(`/posts/1/comment`)
        .send({ user, content: "This is a test comment", parentId: -1 })
        .expect(200);

      const user1 = await User.findById(user._id);
      expect(user1?.notifications).toHaveLength(0);
      const modUser1 = await User.findById(modUser._id);
      expect(modUser1?.notifications).toHaveLength(1);
      const notification = modUser1
        ?.notifications[0] as INewCommentNotification;
      expect(notification.type).toBe("newComment");
      expect(notification.content.postNumber).toBe(1);
      expect(notification.content.userName).toBe(user.givenName);
      expect(notification.timestamp).toBeDefined();
    });

    it("should send notifications while limiting max notifications to 100", async () => {
      await Promise.all(
        Array.from({ length: 3 }, (_, i) =>
          Post.create({
            content: "This is a test post",
            approved: true,
            postNumber: i + 1,
            subscribers: [modUser._id],
          })
        )
      );

      await Promise.all(
        Array.from({ length: 5 }, () =>
          request(app)
            .post("/posts/1/comment")
            .send({ user, content: "This is a test comment", parentId: -1 })
            .expect(200)
        )
      );
      await Promise.all(
        Array.from({ length: 100 }, () =>
          request(app)
            .post("/posts/2/comment")
            .send({ user, content: "This is a test comment", parentId: -1 })
            .expect(200)
        )
      );
      await Promise.all(
        Array.from({ length: 5 }, () =>
          request(app)
            .post("/posts/3/comment")
            .send({ user, content: "This is a test comment", parentId: -1 })
            .expect(200)
        )
      );

      const modUser1 = await User.findById(modUser._id);
      expect(modUser1?.notifications).toHaveLength(100);

      const notifications =
        modUser1?.notifications as INewCommentNotification[];
      expect(notifications.some((n) => n.content.postNumber === 1)).toBe(false);
      expect(notifications[0].content.postNumber).toBe(2);
      expect(notifications[99].content.postNumber).toBe(3);
    });

    it("should not send notifications yet if comment is anonymous", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
        subscribers: [user._id, modUser._id],
      });
      await post.save();

      await request(app)
        .post(`/posts/1/comment`)
        .send({
          user,
          content: "This is a test comment",
          parentId: -1,
          anonymous: true,
        })
        .expect(200);

      const user1 = await User.findById(user._id);
      expect(user1?.notifications).toHaveLength(0);
      const modUser1 = await User.findById(modUser._id);
      expect(modUser1?.notifications).toHaveLength(0);
    });

    it("should auto subscribe to post if user has that option enabled", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app)
        .post(`/posts/1/comment`)
        .send({ user, content: "This is a test comment", parentId: -1 })
        .expect(200);

      await request(app)
        .post(`/posts/1/comment`)
        .send({ user, content: "This is another test comment!", parentId: -1 })
        .expect(200);

      const post1 = await Post.findById(post._id);
      expect(post1?.subscribers).toHaveLength(1);
      expect(post1?.subscribers[0]).toStrictEqual(user._id);

      const user1 = await User.findById(user._id);
      expect(user1?.subscriptions).toHaveLength(1);
      expect(user1?.subscriptions[0]).toStrictEqual(post._id);

      user.settings.autoSubscribe = false;
      await Post.updateOne({ _id: post._id }, { subscribers: [] });
      await User.updateOne({ _id: user._id }, { subscriptions: [] });

      await request(app)
        .post(`/posts/1/comment`)
        .send({ user, content: "This is a third comment...", parentId: -1 })
        .expect(200);

      const post2 = await Post.findById(post._id);
      expect(post2?.subscribers).toHaveLength(0);

      const user2 = await User.findById(user._id);
      expect(user2?.subscriptions).toHaveLength(0);
    });
  });

  describe("PUT /posts/:id/comment/:commentId/approve", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).put("/posts/1/comment/1/approve").expect(401);
    });

    it("should return 401 if not mod", async () => {
      await request(app)
        .put("/posts/1/comment/1/approve")
        .send({ user, approved: true })
        .expect(401);
    });

    it("should return 404 if the post does not exist", async () => {
      await request(app)
        .put("/posts/1/comment/1/approve")
        .send({ user: modUser, approved: true })
        .expect(404);
    });

    it("should return 404 if the comment does not exist", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app)
        .put("/posts/1/comment/1/approve")
        .send({ user: modUser, approved: true })
        .expect(404);
    });

    it("should return 200 if logged in and the post exists and the comment is valid", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        commentNumber: 1,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        author: user._id,
        approved: false,
      });
      await comment.save();

      post.comments.push(comment);
      await post.save();

      await request(app)
        .put(`/posts/1/comment/1/approve`)
        .send({ user: modUser, approved: true })
        .expect(200);

      const post2 = await Post.findOne().populate("comments");
      expect(post2?.score).toBe(0);
      expect(post2?.hotScore).toBe(0);
      expect(post2?.comments[0].approved).toBe(true);
      expect(post2?.comments[0].needsReview).toBe(false);

      await request(app)
        .put(`/posts/1/comment/1/approve`)
        .send({ user: modUser, approved: false })
        .expect(200);

      const post3 = await Post.findOne().populate("comments");
      expect(post3?.comments[0].approved).toBe(false);
      expect(post3?.comments[0].needsReview).toBe(false);
    });

    it("should approve anonymous comments and award points to post score", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        commentNumber: 1,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        author: null,
        approved: false,
      });
      await comment.save();

      post.comments.push(comment);
      await post.save();

      await request(app)
        .put(`/posts/1/comment/1/approve`)
        .send({ user: modUser, approved: true })
        .expect(200);

      const post2 = await Post.findOne().populate("comments");
      expect(post2?.score).toBe(0.75);
      expect(post2?.hotScore).toBe(0.75);
      expect(post2?.comments[0].approved).toBe(true);
      expect(post2?.comments[0].needsReview).toBe(false);
    });

    it("should send notifications to subscribers if comment is anonymous", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
        subscribers: [user._id, modUser._id],
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        commentNumber: 1,
        author: null,
      });
      await comment.save();

      post.comments.push(comment);
      await post.save();

      await request(app)
        .put(`/posts/1/comment/1/approve`)
        .send({ user: modUser, approved: true })
        .expect(200);

      const user1 = await User.findById(user._id);
      expect(user1?.notifications).toHaveLength(1);
      const modUser1 = await User.findById(modUser._id);
      expect(modUser1?.notifications).toHaveLength(1);
      const notification = modUser1
        ?.notifications[0] as INewCommentNotification;
      expect(notification.type).toBe("newComment");
      expect(notification.content.postNumber).toBe(1);
      expect(notification.content.userName).toBe("Anonymous");
    });

    it("should send notifications while limiting max notifications to 100", async () => {
      const post = await Post.create({
        content: "My post!",
        approved: true,
        postNumber: 1,
        subscribers: [user._id],
      });

      const comments = await Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          Comment.create({
            content: "This is a test comment",
            post: post._id,
            postNumber: 1,
            parentCommentNumber: -1,
            commentNumber: i + 1,
            author: null,
          })
        )
      );
      post.comments.push(...comments);
      await post.save();

      const user1 = await User.findById(user._id);
      for (let i = 0; i < 100; i++) {
        user1?.notifications.push({
          type: "trendingPost",
          timestamp: new Date(),
          content: {
            postNumber: 1,
            content: "My post!",
          },
        });
      }
      await user1?.save();

      await Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          request(app)
            .put(`/posts/1/comment/${i + 1}/approve`)
            .send({ user: modUser, approved: true })
            .expect(200)
        )
      );

      const user2 = await User.findById(user._id);
      expect(user2?.notifications).toHaveLength(100);

      const notifications = user2?.notifications ?? [];
      expect(notifications[0].type).toBe("trendingPost");
      expect(notifications[99].type).toBe("newComment");
    });
  });

  describe("PUT /posts/:id/comment/:commentId/react", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).put("/posts/1/comment/1/react").expect(401);
    });

    it("should return 404 if the post does not exist", async () => {
      await request(app)
        .put("/posts/1/comment/1/react")
        .send({ user, reaction: 1, state: true })
        .expect(404);
    });

    it("should return 404 if the comment does not exist", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app)
        .put("/posts/1/comment/1/react")
        .send({ user, reaction: 1, state: true })
        .expect(404);
    });

    it("should return 400 if reaction not included in body", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        commentNumber: 1,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        author: user._id,
      });
      await comment.save();

      post.comments.push(comment);
      await post.save();

      await request(app)
        .put(`/posts/1/comment/1/react`)
        .send({ user, state: false })
        .expect(400);
    });

    it("should return 200 if logged in and the post exists and the comment is valid", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        commentNumber: 1,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        author: user._id,
      });
      await comment.save();

      post.comments.push(comment);
      await post.save();

      await request(app)
        .put(`/posts/1/comment/1/react`)
        .send({ user, reaction: 1, state: true })
        .expect(200);

      const post2 = await Post.findOne().populate("comments");
      expect(post2?.comments[0].reactions[0]).toHaveLength(1);
      expect(post2?.comments[0].reactions[0][0]).toStrictEqual(user._id);
      expect(post2?.score).toBe(0.25);
      expect(post2?.hotScore).toBe(0.25);

      const commenter = await User.findById(user._id);
      expect(commenter?.xp).toBe(1);

      await request(app)
        .put(`/posts/1/comment/1/react`)
        .send({ user, reaction: 1, state: false })
        .expect(200);

      const post3 = await Post.findOne().populate("comments");
      expect(post3?.comments[0].reactions[0]).toHaveLength(0);
      expect(post3?.score).toBe(0);
      expect(post3?.hotScore).toBe(0);

      const commenter2 = await User.findById(user._id);
      expect(commenter2?.xp).toBe(0);
    });
  });

  describe("DELETE /posts/:postNumber/comment/:commentNumber", () => {
    it("should return 400 if commentNumber is malformed", async () => {
      await request(app)
        .delete("/posts/1/comment/abc")
        .send({ user })
        .expect(400);
    });

    it("should return 404 if the comment does not exist", async () => {
      await request(app)
        .delete("/posts/1/comment/1")
        .send({ user })
        .expect(404);
    });

    it("should return 403 if you attempt to delete a comment you did not create", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        commentNumber: 1,
        post: post._id,
        postNumber: 1,
        author: modUser._id,
      });
      await comment.save();

      post.comments.push(comment);
      await post.save();

      await request(app)
        .delete("/posts/1/comment/1")
        .send({ user })
        .expect(403);
    });

    it("should return 200 if the comment exists", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        commentNumber: 1,
        post: post._id,
        postNumber: 1,
        author: user._id,
      });
      await comment.save();

      post.comments.push(comment);
      await post.save();

      await request(app)
        .delete("/posts/1/comment/1")
        .send({ user })
        .expect(200);

      const res = await Post.findById(post._id).populate("comments");
      expect(res?.comments[0].approved).toBe(false);
      expect(res?.comments[0].needsReview).toBe(false);

      const commenter = await User.findById(user._id);
      expect(commenter?.xp).toBe(-2);
    });

    it("should replace comment content if comment has replies", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        commentNumber: 1,
        post: post._id,
        postNumber: 1,
        author: user._id,
      });
      await comment.save();

      const comment2 = new Comment({
        content: "This is a test reply comment",
        commentNumber: 1,
        post: post._id,
        postNumber: 1,
        author: user._id,
        parentComment: comment._id,
        parentCommentNumber: 1,
      });
      await comment2.save();

      post.comments.push(comment, comment2);
      await post.save();

      await request(app)
        .delete("/posts/1/comment/1")
        .send({ user })
        .expect(200);

      const res = await Post.findById(post._id).populate("comments");
      expect(res?.comments[0].approved).toBe(true);
      expect(res?.comments[0].content).toBe("[deleted]");
      expect(res?.comments[0].author).toBeFalsy();
      expect(res?.comments[1].content).toBe("This is a test reply comment");
    });
  });

  describe("POST /posts/:postNumber/comment/:commentNumber/flag", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).post("/posts/1/comment/1/flag").expect(401);
    });

    it("should return 400 if does not include reason or if reason is not a string", async () => {
      await request(app)
        .post("/posts/1/comment/1/flag")
        .send({ user })
        .expect(400);

      await request(app)
        .post("/posts/1/comment/1/flag")
        .send({ user, reason: 1 })
        .expect(400);

      await request(app)
        .post("/posts/1/comment/1/flag")
        .send({ user, reason: "test" })
        .expect(400);
    });

    it("should return 404 if post or comment does not exist or is not approved", async () => {
      await request(app)
        .post("/posts/1/comment/1/flag")
        .send({ user, reason: "This comment is so bad!" })
        .expect(404);

      const post = new Post({
        content: "This is a test post",
        approved: false,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        approved: true,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        commentNumber: 1,
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      await request(app)
        .post("/posts/1/comment/1/flag")
        .send({ user, reason: "This comment is so bad!" })
        .expect(404);

      post.approved = true;
      await post.save();

      comment.approved = false;
      await comment.save();

      await request(app)
        .post("/posts/1/comment/1/flag")
        .send({ user, reason: "This comment is so bad!" })
        .expect(404);
    });

    it("should create a report when a comment is flagged", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        approved: true,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        commentNumber: 1,
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      const posts = await Post.find({});
      const comments = await Comment.find({});
      expect(posts).toHaveLength(1);
      expect(comments).toHaveLength(1);

      await request(app)
        .post("/posts/1/comment/1/flag")
        .send({ user, reason: "This comment is so bad!" })
        .expect(200);

      const resReport = await Report.findOne();
      expect(resReport).toBeDefined();
      expect(resReport?.post).toStrictEqual(post._id);
      expect(resReport?.comment).toStrictEqual(comment._id);
      expect(resReport?.reason).toBe("This comment is so bad!");
      expect(resReport?.timeSubmitted).toBeDefined();
    });

    it("should not create duplicate reports", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        approved: true,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        commentNumber: 1,
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      await Report.create({
        post: post._id,
        comment: comment._id,
        reason: "This comment is so bad!",
      });

      await request(app)
        .post("/posts/1/comment/1/flag")
        .send({ user, reason: "This comment is so bad!" })
        .expect(200);

      const reportsCount = await Report.countDocuments();
      expect(reportsCount).toBe(1);
    });
  });

  describe("GET /posts/mod-feed/reports", () => {
    it("should return 401 if not logged in or if user is not a moderator", async () => {
      await request(app).get("/posts/mod-feed/reports").expect(401);
      await request(app)
        .get("/posts/mod-feed/reports")
        .send({ user })
        .expect(401);
    });

    it("should should return feed of unresolved reports", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        approved: true,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        commentNumber: 1,
        author: user._id,
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      await Promise.all([
        Array(2)
          .fill(null)
          .map(async () =>
            Report.create({
              post: post._id,
              comment: comment._id,
              reason: "This comment is so bad!",
            })
          ),
        Report.create({
          post: post._id,
          comment: comment._id,
          reason: "Already resolved...",
          resolved: true,
        }),
      ]);

      const res = await request(app)
        .get("/posts/mod-feed/reports")
        .send({ user: modUser })
        .expect(200);

      expect(res.body).toHaveLength(2);

      const resReport = res.body[0] as IReport;
      expect(resReport.post._id).toBe(post._id.toString());
      expect(resReport.post.content).toBe("This is a test post");
      expect(resReport.post.postNumber).toBe(1);
      expect(resReport.comment._id).toBe(comment._id.toString());
      expect(resReport.comment.content).toBe("This is a test comment");
      expect(resReport.comment.commentNumber).toBe(1);
      expect(resReport.comment.author._id).toBe(user._id.toString());
      expect(resReport.comment.author.name).toBe("Bob");
      expect(resReport.reason).toBe("This comment is so bad!");
      expect(resReport.timeSubmitted).toBeDefined();
      expect(resReport.resolved).toBe(false);

      const resReport2 = res.body[1] as IReport;
      expect(resReport2.resolved).toBe(false);
    });

    it("should should return paginated feed of reports", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        approved: true,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        commentNumber: 1,
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      await Promise.all(
        Array(11)
          .fill(null)
          .map(async () =>
            Report.create({
              post: post._id,
              comment: comment._id,
              reason: "Severely offensive",
            })
          )
      );

      const res = await request(app)
        .get("/posts/mod-feed/reports?page=1")
        .send({ user: modUser })
        .expect(200);

      expect(res.body).toHaveLength(10);

      const resReport = res.body[0] as IReport;
      expect(resReport.post._id).toBe(post._id.toString());
      expect(resReport.post.content).toBe("This is a test post");

      const res2 = await request(app)
        .get("/posts/mod-feed/reports?page=2")
        .send({ user: modUser })
        .expect(200);

      expect(res2.body).toHaveLength(1);
    });

    it("should populate reports with parent comments", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is the parent comment",
        approved: true,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        commentNumber: 1,
        author: user._id,
      });
      await comment.save();

      const comment2 = new Comment({
        content: "This is the child comment",
        approved: true,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: 1,
        parentComment: comment._id,
        commentNumber: 2,
      });
      await comment2.save();

      post.comments.push(comment._id);
      post.comments.push(comment2._id);
      await post.save();

      await Report.create({
        post: post._id,
        comment: comment2._id,
        reason: "This comment is so bad!",
      });

      const res = await request(app)
        .get("/posts/mod-feed/reports")
        .send({ user: modUser })
        .expect(200);

      const resReport = res.body[0] as IReport;
      expect(resReport.comment.parentComment).toBeDefined();
      expect(resReport.comment.parentComment?.content).toBe(
        "This is the parent comment"
      );
      expect(resReport.comment.parentComment?.commentNumber).toBe(1);
      expect(resReport.comment.parentComment?.author.name).toBe("Bob");
    });
  });

  describe("PUT /posts/:postId/comment/:commentId/resolve", () => {
    it("should return 401 if not logged in or if user is not a moderator", async () => {
      await request(app).put("/posts/1/comment/1/resolve").expect(401);
      await request(app)
        .put("/posts/1/comment/1/resolve")
        .send({ user })
        .expect(401);
    });

    it("should return 404 if post or comment does not exist", async () => {
      await request(app)
        .put("/posts/1/comment/1/resolve")
        .send({ user: modUser })
        .expect(404);

      await Post.create({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });

      await request(app)
        .put("/posts/1/comment/1/resolve")
        .send({ user: modUser })
        .expect(404);
    });

    it("should return 404 if report does not exist", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        approved: true,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        commentNumber: 1,
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      await request(app)
        .put("/posts/1/comment/1/resolve")
        .send({ user: modUser })
        .expect(404);
    });

    it("should return 200 if report is resolved", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        approved: true,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        commentNumber: 1,
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      const report = await Report.create({
        post: post._id,
        comment: comment._id,
        reason: "This comment is so bad!",
      });

      await request(app)
        .put("/posts/1/comment/1/resolve")
        .send({ user: modUser })
        .expect(200);

      const resReport = await Report.findById(report._id);
      expect(resReport?.resolved).toBe(true);
      expect(resReport?.resolvedBy).toStrictEqual(modUser._id);
    });

    it("should have no effect if report is already resolved", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        approved: true,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: -1,
        commentNumber: 1,
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      const report = await Report.create({
        post: post._id,
        comment: comment._id,
        reason: "This comment is so bad!",
        resolved: true,
      });

      await request(app)
        .put("/posts/1/comment/1/resolve")
        .send({ user: modUser })
        .expect(200);

      const resReport = await Report.findById(report._id);
      expect(resReport?.resolved).toBe(true);
      expect(resReport?.resolvedBy).toStrictEqual(modUser._id);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });
});
