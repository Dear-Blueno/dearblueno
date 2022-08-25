import { Express } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Post from "../../models/Post";
import Comment from "../../models/Comment";
import User, { IUser } from "../../models/User";
import request from "supertest";
import setupForTests, { resetCollections } from "../testUtil";

describe("Posts", () => {
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
    await resetCollections();

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

  describe("GET /posts", () => {
    it("should return a sorted array of posts if no query offered", async () => {
      await new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
      }).save();
      await new Post({
        content: "This is another test post",
        postNumber: 2,
        approved: true,
      }).save();

      const res = await request(app).get("/posts").expect(200);
      expect(res.body).toHaveLength(2);

      expect(res.body[1].content).toBe("This is a test post");
      expect(res.body[1].postNumber).toBe(1);
      expect(res.body[1].approved).toBe(true);
      expect(res.body[1].verifiedBrown).toBe(true);
      expect(res.body[1].postTime).toBeDefined();

      expect(res.body[0].content).toBe("This is another test post");
      expect(res.body[0].postNumber).toBe(2);
      expect(res.body[0].approved).toBe(true);
      expect(res.body[0].verifiedBrown).toBe(true);
    });

    it("should return an array of paginated posts if query is provided", async () => {
      await new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
      }).save();

      const res = await request(app).get("/posts?page=1").expect(200);
      expect(res.body).toHaveLength(1);

      expect(res.body[0].content).toBe("This is a test post");
      expect(res.body[0].postNumber).toBe(1);

      const res2 = await request(app).get("/posts?page=2").expect(200);
      expect(res2.body).toHaveLength(0);
    });

    it("should not display posts that are not approved", async () => {
      await new Post({
        content: "This is a test post",
      }).save();

      const res = await request(app).get("/posts").expect(200);
      expect(res.body).toHaveLength(0);
    });

    it("should not display more than 10 posts per page", async () => {
      const promises = [];
      for (let i = 0; i < 15; i++) {
        promises.push(
          new Post({
            content: `This is a test post ${i}`,
            postNumber: i,
            approved: true,
          }).save()
        );
      }
      await Promise.all(promises);

      const res = await request(app).get("/posts").expect(200);
      expect(res.body).toHaveLength(10);
    });

    it("should include comments in the response but not unapproved comments", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        post: post._id,
        postNumber: 1,
        commentNumber: 1,
        author: user._id,
      });
      await comment.save();

      const comment2 = new Comment({
        content: "This is another test comment",
        post: post._id,
        postNumber: 1,
        commentNumber: 2,
        author: user._id,
        approved: false,
      });
      await comment2.save();

      post.comments.push(comment._id);
      post.comments.push(comment2._id);
      await post.save();

      const res = await request(app).get("/posts").expect(200);
      expect(res.body[0].comments).toHaveLength(1);
      expect(res.body[0].comments[0].content).toBe("This is a test comment");
      expect(res.body[0].comments[0].commentNumber).toBe(1);
      expect(res.body[0].comments[0].author.name).toBe("Bob");
    });

    it("should not include user details of reactions", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        reactions: [[user._id], [], [], [], [], []],
      });
      await post.save();

      const res = await request(app).get("/posts").expect(200);
      expect(res.body[0].reactions[0]).toHaveLength(1);
      expect(res.body[0].reactions[0][0].name).toBeUndefined();
      expect(res.body[0].reactions[0][0]).toBe("anon");

      const res2 = await request(app).get("/posts").send({ user }).expect(200);
      expect(res2.body[0].reactions[0]).toHaveLength(1);
      expect(res2.body[0].reactions[0][0]).toBe(String(user._id));
    });

    it("should not include sensitive information of users", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        reactions: [[user._id], [], [], [], [], []],
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        post: post._id,
        postNumber: 1,
        commentNumber: 1,
        author: user._id,
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      const res = await request(app).get("/posts").expect(200);
      expect(res.body[0].comments[0].author.moderator).toBeUndefined();
      expect(res.body[0].comments[0].author.lastLoggedIn).toBeUndefined();
      expect(res.body[0].comments[0].author.email).toBeUndefined();
    });

    it("should not include sensitive information of posts", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        approvedBy: modUser._id,
      });
      await post.save();

      const res = await request(app).get("/posts").expect(200);
      expect(res.body[0].approvedBy).toBeUndefined();
    });

    it("should include pinned posts at the top of the list", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        pinned: true,
      });
      await post.save();

      const post2 = new Post({
        content: "This is another test post",
        postNumber: 2,
        approved: true,
      });
      await post2.save();

      const res = await request(app).get("/posts").expect(200);

      expect(res.body[0].content).toBe("This is a test post");
      expect(res.body[0].postNumber).toBe(1);
      expect(res.body[0].pinned).toBe(true);

      expect(res.body[1].content).toBe("This is another test post");
      expect(res.body[1].postNumber).toBe(2);
      expect(res.body[1].pinned).toBeFalsy();
    });

    it("should sort by top of all time", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        approvedTime: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
        score: 100,
      });
      const post2 = new Post({
        content: "This is another test post",
        postNumber: 2,
        approved: true,
        approvedTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        score: 50,
      });
      const post3 = new Post({
        content: "This is a third test post",
        postNumber: 3,
        approved: true,
        approvedTime: new Date(),
        score: 75,
      });
      await Promise.all([post.save(), post2.save(), post3.save()]);

      const res = await request(app).get("/posts?sort=topAllTime").expect(200);
      expect(res.body).toHaveLength(3);

      expect(res.body[0].postNumber).toBe(1);
      expect(res.body[1].postNumber).toBe(3);
      expect(res.body[2].postNumber).toBe(2);
    });

    it("should sort by top of week", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        approvedTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        score: 100,
      });
      const post2 = new Post({
        content: "This is another test post",
        postNumber: 2,
        approved: true,
        approvedTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        score: 50,
      });
      const post3 = new Post({
        content: "This is a third test post",
        postNumber: 3,
        approved: true,
        approvedTime: new Date(),
        score: 75,
      });
      await Promise.all([post.save(), post2.save(), post3.save()]);

      const res = await request(app).get("/posts?sort=topWeek").expect(200);
      expect(res.body).toHaveLength(2);

      expect(res.body[0].postNumber).toBe(3);
      expect(res.body[1].postNumber).toBe(2);
    });

    it("should sort by top of month", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        approvedTime: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
        score: 100,
      });
      const post2 = new Post({
        content: "This is another test post",
        postNumber: 2,
        approved: true,
        approvedTime: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
        score: 50,
      });
      const post3 = new Post({
        content: "This is a third test post",
        postNumber: 3,
        approved: true,
        approvedTime: new Date(),
        score: 75,
      });
      await Promise.all([post.save(), post2.save(), post3.save()]);

      const res = await request(app).get("/posts?sort=topMonth").expect(200);
      expect(res.body).toHaveLength(2);

      expect(res.body[0].postNumber).toBe(3);
      expect(res.body[1].postNumber).toBe(2);
    });

    it("should sort by hot", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        approvedTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        hotScore: 100,
      });
      const post2 = new Post({
        content: "This is another test post",
        postNumber: 2,
        approved: true,
        approvedTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        hotScore: 50,
      });
      const post3 = new Post({
        content: "This is a third test post",
        postNumber: 3,
        approved: true,
        approvedTime: new Date(),
        hotScore: 75,
      });
      await Promise.all([post.save(), post2.save(), post3.save()]);

      const res = await request(app).get("/posts?sort=hot").expect(200);
      expect(res.body).toHaveLength(2);

      expect(res.body[0].postNumber).toBe(3);
      expect(res.body[1].postNumber).toBe(2);
    });
  });

  describe("GET /posts/all", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).get("/posts/all").expect(401);
    });

    it("should return 401 if not a mod", async () => {
      await request(app).get("/posts/all").send({ user }).expect(401);
    });

    it("should return an array of all posts if logged in as a mod", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: false,
      });
      await post.save();

      const post2 = new Post({
        content: "This is another test post",
        postNumber: 2,
        approved: true,
      });
      await post2.save();

      const res = await request(app)
        .get("/posts/all")
        .send({ user: modUser })
        .expect(200);
      expect(res.body).toHaveLength(2);

      expect(res.body[1].content).toBe("This is a test post");
      expect(res.body[1].postNumber).toBe(1);
      expect(res.body[1].approved).toBe(false);

      expect(res.body[0].content).toBe("This is another test post");
      expect(res.body[0].postNumber).toBe(2);
      expect(res.body[0].approved).toBe(true);
    });

    it("should include both approved and unapproved comments", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        post: post._id,
        postNumber: 1,
        commentNumber: 1,
        author: user._id,
      });
      await comment.save();

      const comment2 = new Comment({
        content: "This is another test comment",
        post: post._id,
        postNumber: 1,
        commentNumber: 2,
        author: user._id,
        approved: false,
      });
      await comment2.save();

      post.comments.push(comment);
      post.comments.push(comment2);
      await post.save();

      const res = await request(app)
        .get("/posts/all")
        .send({ user: modUser })
        .expect(200);

      expect(res.body[0].comments).toHaveLength(2);
      expect(res.body[0].comments[0].content).toBe("This is a test comment");
      expect(res.body[0].comments[0].commentNumber).toBe(1);
      expect(res.body[0].comments[0].author.name).toBe("Bob");
      expect(res.body[0].comments[1].commentNumber).toBe(2);
      expect(res.body[0].comments[1].author.name).toBe("Bob");
    });
  });

  describe("GET /posts/mod-feed", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).get("/posts/mod-feed").expect(401);
    });

    it("should return 401 if not a mod", async () => {
      await request(app).get("/posts/mod-feed").send({ user }).expect(401);
    });

    it("should return an array of needs review posts if logged in as a mod", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: false,
        needsReview: true,
      });
      await post.save();

      const post2 = new Post({
        content: "This is another test post",
        postNumber: 2,
        approved: true,
        needsReview: true,
      });
      await post2.save();

      const post3 = new Post({
        content: "This is yet another test post",
        postNumber: 3,
        approved: true,
        needsReview: false,
      });
      await post3.save();

      const res = await request(app)
        .get("/posts/mod-feed")
        .send({ user: modUser })
        .expect(200);
      expect(res.body).toHaveLength(2);

      expect(res.body[1].content).toBe("This is another test post");
      expect(res.body[1].postNumber).toBe(2);
      expect(res.body[1].approved).toBe(true);

      expect(res.body[0].content).toBe("This is a test post");
      expect(res.body[0].postNumber).toBe(1);
      expect(res.body[0].approved).toBe(false);
    });
  });

  describe("GET /posts/:id", () => {
    it("should return a post if it exists", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
      });
      await post.save();

      const res = await request(app).get("/posts/1").expect(200);
      expect(res.body.content).toBe("This is a test post");
      expect(res.body.postNumber).toBe(1);
    });

    it("should return a 404 if the post does not exist", async () => {
      await request(app).get("/posts/123").expect(404);
    });

    it("should return a 404 if the post is not approved", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: false,
      });
      await post.save();

      await request(app).get("/posts/1").expect(404);
      await request(app).get(`/posts/${post._id}`).expect(400);
    });

    it("should display post comments but not unapproved comments", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
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

      const comment2 = new Comment({
        content: "This is another test comment",
        commentNumber: 2,
        post: post._id,
        postNumber: 1,
        parentCommentNumber: 1,
        author: user._id,
        approved: false,
      });
      await comment2.save();

      post.comments.push(comment);
      post.comments.push(comment2);
      await post.save();

      const res = await request(app).get("/posts/1").expect(200);
      expect(res.body.comments).toHaveLength(1);
      expect(res.body.comments[0].content).toBe("This is a test comment");
      expect(res.body.comments[0].commentNumber).toBe(1);
      expect(res.body.comments[0].author.name).toBe("Bob");
    });

    it("should not include sensitive information of users", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        reactions: [[user._id], [], [], [], [], []],
      });
      await post.save();

      const comment = new Comment({
        content: "This is a test comment",
        post: post._id,
        postNumber: 1,
        commentNumber: 1,
        author: user._id,
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      const res = await request(app).get("/posts/1").expect(200);
      expect(res.body.comments[0].author.email).toBe(undefined);
      expect(res.body.comments[0].author.moderator).toBe(undefined);
      expect(res.body.comments[0].author.lastLoggedIn).toBe(undefined);
    });

    it("should not include sensitive information of posts", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        approvedBy: modUser._id,
      });
      await post.save();

      const res = await request(app).get("/posts/1").expect(200);
      expect(res.body.approvedBy).toBe(undefined);
    });
  });

  describe("POST /posts", () => {
    it("should return 400 if no content is provided", async () => {
      await request(app).post("/posts").send({ user }).expect(400);
      expect(await Post.count()).toBe(0);
    });

    it("should return 400 if content is less than 1 character", async () => {
      await request(app).post("/posts").send({ user, content: "" }).expect(400);
      expect(await Post.count()).toBe(0);
    });

    it("should return 400 if content is more than 5000 characters", async () => {
      await request(app)
        .post("/posts")
        .send({ user, content: "a".repeat(5001) })
        .expect(400);
      expect(await Post.count()).toBe(0);
    });

    it("should return 200 if logged in and content is valid", async () => {
      await request(app)
        .post("/posts")
        .send({ user, content: "This is a test post" })
        .expect(200);

      expect(await Post.count()).toBe(1);

      const post = await Post.findOne();
      expect(post).toBeDefined();
      expect(post?.content).toBe("This is a test post");
      expect(post?.postNumber).toBeUndefined();
      expect(post?.approved).toBe(false);
      expect(post?.needsReview).toBe(true);
      expect(post?.reactions[0]).toHaveLength(0);
      expect(post?.comments).toHaveLength(0);
      expect(post?.verifiedBrown).toBe(false);
    });

    it("should return 200 if not logged in and content is valid", async () => {
      await request(app)
        .post("/posts")
        .send({ content: "This is a test post" })
        .expect(200);

      expect(await Post.count()).toBe(1);

      const post = await Post.findOne();
      expect(post).toBeDefined();
      expect(post?.content).toBe("This is a test post");
      expect(post?.postNumber).toBeUndefined();
      expect(post?.approved).toBe(false);
      expect(post?.reactions[0]).toHaveLength(0);
      expect(post?.comments).toHaveLength(0);
      expect(post?.verifiedBrown).toBe(false);
    });

    it("should return 200 if verified logged in and content is valid", async () => {
      await request(app)
        .post("/posts")
        .send({ user: modUser, content: "This is a test post" })
        .expect(200);

      expect(await Post.count()).toBe(1);

      const post = await Post.findOne();
      expect(post).toBeDefined();
      expect(post?.content).toBe("This is a test post");
      expect(post?.postNumber).toBeUndefined();
      expect(post?.approved).toBe(false);
      expect(post?.needsReview).toBe(true);
      expect(post?.comments).toHaveLength(0);
      expect(post?.verifiedBrown).toBe(true);
    });
  });

  describe("PUT /posts/:id/approve", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).put("/posts/1/approve").expect(401);
    });

    it("should return 401 if not a mod", async () => {
      await request(app).put("/posts/1/approve").send({ user }).expect(401);
    });

    it("should return 400 if the post does not exist", async () => {
      await request(app)
        .put("/posts/1/approve")
        .send({ user: modUser })
        .expect(400);
    });

    it("should return 200 if all valid to approve", async () => {
      const post = new Post({
        content: "This is a test post",
      });
      await post.save();

      await request(app)
        .put(`/posts/${post._id}/approve`)
        .send({ user: modUser, approved: true })
        .expect(200);

      const post2 = await Post.findOne();
      expect(post2?.approved).toBe(true);
      expect(post2?.needsReview).toBe(false);
      expect(post2?.postNumber).toBe(1);
      expect(post2?.approvedBy).toStrictEqual(modUser._id);
      expect(post2?.approvedTime).toBeDefined();
      expect(post2?.contentWarning).toBeUndefined();
    });

    it("should return 200 if all valid to unapprove", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
      });
      await post.save();

      await request(app)
        .put(`/posts/${post._id}/approve`)
        .send({ user: modUser, approved: false })
        .expect(200);

      const post2 = await Post.findOne();
      expect(post2?.approved).toBe(false);
      expect(post2?.needsReview).toBe(false);
      expect(post2?.approvedBy).toStrictEqual(modUser._id);
      expect(post2?.approvedTime).toBeDefined();
    });

    it("should add content warning to post if included in request", async () => {
      const post = new Post({
        content: "This is a test post",
      });
      await post.save();

      await request(app)
        .put(`/posts/${post._id}/approve`)
        .send({
          user: modUser,
          approved: true,
          contentWarning: "This is a test warning",
        })
        .expect(200);

      const post2 = await Post.findOne();
      expect(post2?.contentWarning).toBe("This is a test warning");
    });
  });

  describe("PUT /posts/:id/react", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).put("/posts/1/react").expect(401);
    });

    it("should return 404 if the post does not exist", async () => {
      await request(app)
        .put("/posts/1/react")
        .send({ user, reaction: 1, state: true })
        .expect(404);
    });

    it("should return 404 if the post is unapproved", async () => {
      const post = new Post({
        content: "This is a test post",
      });
      await post.save();

      await request(app)
        .put(`/posts/1/react`)
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

      await request(app)
        .put(`/posts/1/react`)
        .send({ user, state: false })
        .expect(400);

      const post2 = await Post.findOne();
      expect(post2?.reactions[0]).toHaveLength(0);
    });

    it("should return 200 if logged in and the post exists and the reaction is valid", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app)
        .put(`/posts/1/react`)
        .send({ user, reaction: 1, state: true })
        .expect(200);

      const post2 = await Post.findOne();
      expect(post2?.reactions[0]).toHaveLength(1);
      expect(post2?.reactions[0][0]).toStrictEqual(user._id);
      expect(post2?.score).toBe(3);
      expect(post2?.hotScore).toBe(3);
    });

    it("should return 200 if logged in and the post exists and the unreaction is valid", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app)
        .put(`/posts/1/react`)
        .send({ user, reaction: 1, state: true })
        .expect(200);

      await request(app)
        .put(`/posts/1/react`)
        .send({ user, reaction: 1, state: false })
        .expect(200);

      const post2 = await Post.findOne();
      expect(post2?.reactions[0]).toHaveLength(0);
      expect(post2?.score).toBe(0);
      expect(post2?.hotScore).toBe(0);
    });
  });

  describe("GET /posts/search", () => {
    it("should return 400 if no query is included", async () => {
      await request(app).get("/posts/search").expect(400);
    });

    it("should return 200 if query is included", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const post2 = new Post({
        content:
          "This is a another post that notably doesn't contain the t word",
        approved: true,
        postNumber: 2,
      });
      await post2.save();

      const res = await request(app)
        .get("/posts/search?query=test")
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].postNumber).toBe(1);
    });

    it("should not return posts that are not approved", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: false,
        postNumber: 1,
      });
      await post.save();

      const res = await request(app)
        .get("/posts/search?query=test")
        .expect(200);

      expect(res.body).toHaveLength(0);
    });

    it("should sort posts by relevance", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      const post2 = new Post({
        content: "TEST TESTING TESTING TEST TEST test",
        approved: true,
        postNumber: 2,
      });
      await post2.save();

      const post3 = new Post({
        content: "test this is second place test",
        approved: true,
        postNumber: 3,
      });
      await post3.save();

      const res = await request(app)
        .get("/posts/search?query=test")
        .expect(200);

      expect(res.body).toHaveLength(3);
      expect(res.body[0].postNumber).toBe(2);
      expect(res.body[1].postNumber).toBe(3);
      expect(res.body[2].postNumber).toBe(1);

      const res2 = await request(app)
        .get("/posts/search?query=test post")
        .expect(200);

      expect(res2.body).toHaveLength(3);
      expect(res2.body[0].postNumber).toBe(1);
    });

    it("should not leak sensitive information about users or posts", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
        approvedBy: modUser._id,
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

      const res = await request(app)
        .get("/posts/search?query=test")
        .expect(200);

      expect(res.body[0].approvedBy).toBeUndefined();
      expect(res.body[0].comments[0].author.name).toBe("Bob");
      expect(res.body[0].comments[0].author.email).toBeUndefined();
    });
  });

  describe("POST /posts/:postNumber/bookmark", () => {
    it("should return 400 if postNumber is malformed", async () => {
      await request(app).post("/posts/abc/bookmark").send({ user }).expect(400);
    });

    it("should return 404 if the post does not exist", async () => {
      await request(app).post("/posts/1/bookmark").send({ user }).expect(404);
    });

    it("should return 401 if you are not logged in", async () => {
      await request(app).post("/posts/1/bookmark").expect(401);
    });

    it("should return 200 if the bookmark is added", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app)
        .post("/posts/1/bookmark")
        .send({ user, bookmark: true })
        .expect(200);

      const userRes = await User.findById(user._id).select("bookmarks");
      expect(userRes?.bookmarks[0].toString()).toBe(post._id.toString());
    });

    it("should be able to add and remove bookmarks", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app)
        .post("/posts/1/bookmark")
        .send({ user, bookmark: true })
        .expect(200);

      const userRes = await User.findById(user._id).select("bookmarks");
      expect(userRes?.bookmarks[0].toString()).toBe(post._id.toString());

      await request(app)
        .post("/posts/1/bookmark")
        .send({ user, bookmark: false })
        .expect(200);

      const userRes2 = await User.findById(user._id).select("bookmarks");
      expect(userRes2?.bookmarks).toHaveLength(0);
    });
  });

  describe("POST /posts/:postNumber/subscribe", () => {
    it("should return 400 if postNumber is malformed", async () => {
      await request(app)
        .post("/posts/abc/subscribe")
        .send({ user })
        .expect(400);
    });

    it("should return 404 if the post does not exist", async () => {
      await request(app).post("/posts/1/subscribe").send({ user }).expect(404);
    });

    it("should return 401 if you are not logged in", async () => {
      await request(app).post("/posts/1/subscribe").expect(401);
    });

    it("should return 200 if the subscription is added", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app)
        .post("/posts/1/subscribe")
        .send({ user, subscribe: true })
        .expect(200);

      const postRes = await Post.findById(post._id).select("subscribers");
      expect(postRes?.subscribers[0].toString()).toBe(user._id.toString());

      const userRes = await User.findById(user._id).select("subscriptions");
      expect(userRes?.subscriptions[0].toString()).toBe(post._id.toString());
    });

    it("should be able to add and remove subscriptions", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
      });
      await post.save();

      await request(app)
        .post("/posts/1/subscribe")
        .send({ user, subscribe: true })
        .expect(200);

      const postRes = await Post.findById(post._id).select("subscribers");
      expect(postRes?.subscribers[0].toString()).toBe(user._id.toString());
      const userRes = await User.findById(user._id).select("subscriptions");
      expect(userRes?.subscriptions[0].toString()).toBe(post._id.toString());

      await request(app)
        .post("/posts/1/subscribe")
        .send({ user, subscribe: false })
        .expect(200);

      const postRes2 = await Post.findById(post._id).select("subscribers");
      expect(postRes2?.subscribers).toHaveLength(0);
      const userRes2 = await User.findById(user._id).select("subscriptions");
      expect(userRes2?.subscriptions).toHaveLength(0);
    });

    it("should recover from de-synced subscription arrays", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        postNumber: 1,
        subscribers: [user._id],
      });
      await post.save();

      await request(app)
        .post("/posts/1/subscribe")
        .send({ user, subscribe: true })
        .expect(200);

      const postRes = await Post.findById(post._id).select("subscribers");
      expect(postRes?.subscribers[0].toString()).toBe(user._id.toString());
      const userRes = await User.findById(user._id).select("subscriptions");
      expect(userRes?.subscriptions[0].toString()).toBe(post._id.toString());
    });
  });

  describe("GET /posts/reactions", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).get("/posts/reactions").expect(401);
    });

    it("should return a list of cleansed reactions for posts", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        approvedBy: modUser._id,
        postNumber: 1,
        reactions: [[user._id], [user._id, modUser._id], [], [], [], []],
      });
      await post.save();

      const res = await request(app)
        .get("/posts/reactions")
        .send({ user })
        .expect(200);

      expect(res.body).toHaveLength(1);
      const resPost = res.body[0];
      expect(resPost.approvedBy).toBeUndefined();
      expect(resPost.reactions).toHaveLength(6);
      expect(resPost.reactions[0]).toHaveLength(1);
      expect(resPost.reactions[0][0]).toBe(user._id.toString());
      expect(resPost.reactions[1]).toHaveLength(2);
      expect(resPost.reactions[1][0]).toBe(user._id.toString());
      expect(resPost.reactions[1][1]).toBe("anon");
    });

    it("should return a list of cleansed reactions for multiple pages of posts", async () => {
      const promises = [];
      const post1 = new Post({
        content: "This is a test post",
        approved: true,
        approvedBy: modUser._id,
        postNumber: 1,
        reactions: [[], [], [], [], [], [user._id, modUser._id]],
      });
      promises.push(post1.save());
      for (let i = 2; i < 15; i++) {
        const post = new Post({
          content: "This is a test post",
          approved: true,
          postNumber: i,
          reactions: [[user._id], [user._id, modUser._id], [], [], [], []],
        });
        promises.push(post.save());
      }
      await Promise.all(promises);

      const res = await request(app)
        .get("/posts/reactions?page=2")
        .send({ user })
        .expect(200);

      expect(res.body).toHaveLength(4);
      const resPost = res.body[3];
      expect(resPost.approvedBy).toBeUndefined();
      expect(resPost.reactions).toHaveLength(6);
      expect(resPost.reactions[0]).toHaveLength(0);
      expect(resPost.reactions[5]).toHaveLength(2);
      expect(resPost.reactions[5][0]).toBe(user._id.toString());
      expect(resPost.reactions[5][1]).toBe("anon");
    });

    it("should return a list of cleansed reactions for comments", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        approvedBy: modUser._id,
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
        reactions: [[user._id], [user._id, modUser._id], [], [], [], []],
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      const res = await request(app)
        .get("/posts/reactions")
        .send({ user })
        .expect(200);

      expect(res.body).toHaveLength(1);
      const resPost = res.body[0];
      expect(resPost.comments).toHaveLength(1);
      expect(resPost.comments[0].reactions).toHaveLength(6);
      expect(resPost.comments[0].reactions[0]).toHaveLength(1);
      expect(resPost.comments[0].reactions[0][0]).toBe(user._id.toString());
      expect(resPost.comments[0].reactions[1]).toHaveLength(2);
      expect(resPost.comments[0].reactions[1][0]).toBe(user._id.toString());
      expect(resPost.comments[0].reactions[1][1]).toBe("anon");
    });
  });

  describe("GET /posts/:postNumber/reactions", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).get("/posts/1/reactions").expect(401);
    });

    it("should return a list of cleansed reactions for a post", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: true,
        approvedBy: modUser._id,
        postNumber: 1,
        reactions: [[user._id], [user._id, modUser._id], [], [], [], []],
      });
      await post.save();

      const res = await request(app)
        .get("/posts/1/reactions")
        .send({ user })
        .expect(200);

      const resPost = res.body;
      expect(resPost.approvedBy).toBeUndefined();
      expect(resPost.reactions).toHaveLength(6);
      expect(resPost.reactions[0]).toHaveLength(1);
      expect(resPost.reactions[0][0]).toBe(user._id.toString());
      expect(resPost.reactions[1]).toHaveLength(2);
      expect(resPost.reactions[1][0]).toBe(user._id.toString());
      expect(resPost.reactions[1][1]).toBe("anon");
    });

    it("should return a list of cleansed reactions for a comment", async () => {
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
        reactions: [[user._id], [user._id, modUser._id], [], [], [], []],
      });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      const res = await request(app)
        .get("/posts/1/reactions")
        .send({ user })
        .expect(200);

      const resPost = res.body;
      expect(resPost.comments).toHaveLength(1);
      expect(resPost.comments[0].reactions).toHaveLength(6);
      expect(resPost.comments[0].reactions[0]).toHaveLength(1);
      expect(resPost.comments[0].reactions[0][0]).toBe(user._id.toString());
      expect(resPost.comments[0].reactions[1]).toHaveLength(2);
      expect(resPost.comments[0].reactions[1][0]).toBe(user._id.toString());
      expect(resPost.comments[0].reactions[1][1]).toBe("anon");
    });

    it("should return 404 if post does not exist or is not approved", async () => {
      const post = new Post({
        content: "This is a test post",
        approved: false,
        postNumber: 1,
      });
      await post.save();

      await request(app).get("/posts/1/reactions").send({ user }).expect(404);
      await request(app).get("/posts/2/reactions").send({ user }).expect(404);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });
});
