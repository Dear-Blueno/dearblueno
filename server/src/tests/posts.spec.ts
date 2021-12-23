import { Express } from "express";
import mongoose from "mongoose";
import Post from "../models/Post";
import Comment from "../models/Comment";
import User, { IUser } from "../models/User";
import request from "supertest";
import setupForTests from "./testUtil";

describe("Posts", () => {
  let app: Express;
  let user: IUser;
  let modUser: IUser;

  beforeAll(async () => {
    app = await setupForTests();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();

    const userModel = new User({
      googleId: "123",
      name: "Bob",
      email: "bob@dearblueno.net",
      profilePicture: "https://i.imgur.com/2j1RdhZ.png",
      verifiedBrown: false,
    });
    user = await userModel.save();

    const modUserModel = new User({
      googleId: "456",
      name: "Mod",
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
      expect(res.body.length).toBe(2);

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
      expect(res.body.length).toBe(1);

      expect(res.body[0].content).toBe("This is a test post");
      expect(res.body[0].postNumber).toBe(1);

      const res2 = await request(app).get("/posts?page=2").expect(200);
      expect(res2.body.length).toBe(0);
    });

    it("should not display posts that are not approved", async () => {
      await new Post({
        content: "This is a test post",
      }).save();

      const res = await request(app).get("/posts").expect(200);
      expect(res.body.length).toBe(0);
    });

    it("should not display more than 10 posts per page", async () => {
      for (let i = 0; i < 15; i++) {
        await new Post({
          content: `This is a test post ${i}`,
          postNumber: i,
          approved: true,
        }).save();
      }

      const res = await request(app).get("/posts").expect(200);
      expect(res.body.length).toBe(10);
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
      expect(res.body[0].comments.length).toBe(1);
      expect(res.body[0].comments[0].content).toBe("This is a test comment");
      expect(res.body[0].comments[0].commentNumber).toBe(1);
      expect(res.body[0].comments[0].author.name).toBe("Bob");
    });

    it("should not include user details of reactions", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        reactions: [[user._id]],
      });
      await post.save();

      const res = await request(app).get("/posts").expect(200);
      expect(res.body[0].reactions[0].length).toBe(1);
      expect(res.body[0].reactions[0][0].name).toBeUndefined();
    });

    it("should not include sensitive information of users", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        reactions: [[user._id]],
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
      expect(res.body.length).toBe(2);

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

      expect(res.body[0].comments.length).toBe(2);
      expect(res.body[0].comments[0].content).toBe("This is a test comment");
      expect(res.body[0].comments[0].commentNumber).toBe(1);
      expect(res.body[0].comments[0].author.name).toBe("Bob");
      expect(res.body[0].comments[1].commentNumber).toBe(2);
      expect(res.body[0].comments[1].author.name).toBe("Bob");
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
      expect(res.body.comments.length).toBe(1);
      expect(res.body.comments[0].content).toBe("This is a test comment");
      expect(res.body.comments[0].commentNumber).toBe(1);
      expect(res.body.comments[0].author.name).toBe("Bob");
    });

    it("should not include sensitive information of users", async () => {
      const post = new Post({
        content: "This is a test post",
        postNumber: 1,
        approved: true,
        reactions: [[user._id]],
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
      expect(post?.reactions.length).toBe(0);
      expect(post?.comments.length).toBe(0);
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
      expect(post?.reactions.length).toBe(0);
      expect(post?.comments.length).toBe(0);
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
      expect(post?.reactions.length).toBe(0);
      expect(post?.comments.length).toBe(0);
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
      expect(post2?.postNumber).toBe(1);
      expect(post2?.approvedBy).toStrictEqual(modUser._id);
      expect(post2?.approvedTime).toBeDefined();
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
      expect(post2?.approvedBy).toStrictEqual(modUser._id);
      expect(post2?.approvedTime).toBeDefined();
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
      expect(post2?.reactions.length).toBe(0);
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
      expect(post2?.reactions[0].length).toBe(1);
      expect(post2?.reactions[0][0]).toStrictEqual(user._id);
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
      expect(post2?.reactions[0].length).toBe(0);
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
      expect(post2?.comments.length).toBe(0);
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
      expect(post2?.comments.length).toBe(1);
      const comment = post2?.comments[0];
      expect(comment?.content).toBe("This is a test comment");
      expect(comment?.author).toStrictEqual(user._id);
      expect(comment?.commentTime).toBeDefined();
      expect(comment?.approved).toBe(true);
      expect(comment?.postNumber).toBe(1);
      expect(comment?.commentNumber).toBe(1);
      expect(comment?.parentCommentNumber).toBe(-1);
      expect(comment?.post).toStrictEqual(post._id);
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
      expect(post2?.comments[0].approved).toBe(true);

      await request(app)
        .put(`/posts/1/comment/1/approve`)
        .send({ user: modUser, approved: false })
        .expect(200);

      const post3 = await Post.findOne().populate("comments");
      expect(post3?.comments[0].approved).toBe(false);
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
      expect(post2?.comments[0].reactions[0].length).toBe(1);
      expect(post2?.comments[0].reactions[0][0]).toStrictEqual(user._id);

      await request(app)
        .put(`/posts/1/comment/1/react`)
        .send({ user, reaction: 1, state: false })
        .expect(200);

      const post3 = await Post.findOne().populate("comments");
      expect(post3?.comments[0].reactions[0].length).toBe(0);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
