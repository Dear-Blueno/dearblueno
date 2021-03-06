import { Express } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../models/User";
import request from "supertest";
import setupForTests from "./testUtil";
import Comment from "../models/Comment";
import Post from "../models/Post";

describe("User", () => {
  let app: Express;
  let user: IUser;

  beforeAll(async () => {
    app = await setupForTests();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();

    // Create a user
    const userModel = new User({
      googleId: "12345",
      name: "Tom",
      profilePicture: "https://example.com/test.png",
      email: "tom@dearblueno.net",
    });
    user = await userModel.save();
  });

  describe("GET /user/:id", () => {
    it("should return 404 if user is not found", async () => {
      await request(app).get("/user/5bb9e9f84186b222c8901149").expect(404);
    });

    it("should return user if user is found", async () => {
      const response = await request(app).get(`/user/${user._id}`).expect(200);
      expect(response.body.name).toBe(user.name);
      expect(response.body.profilePicture).toBe(user.profilePicture);
    });

    it("should return not reveal sensitive information", async () => {
      const response = await request(app).get(`/user/${user._id}`);
      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty("user.email");
      expect(response.body).not.toHaveProperty("user.lastLoggedIn");
      expect(response.body).not.toHaveProperty("user.moderator");
    });
  });

  describe("GET /user/search", () => {
    it("should return 404 if user is not found", async () => {
      await request(app).get("/user/search?name=george").expect(404);
    });

    it("should return 400 if query is not provided or invalid", async () => {
      await request(app).get("/user/search").expect(400);
      await request(app).get("/user/search?name=").expect(400);
      await request(app).get("/user/search?name=t").expect(400);
      await request(app).get("/user/search?name=!\\!\\!").expect(400);
    });

    it("should return user if user is found", async () => {
      const response = await request(app)
        .get(`/user/search?name=tom`)
        .expect(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe("Tom");
    });

    it("should return not reveal sensitive information", async () => {
      const response = await request(app)
        .get(`/user/search?name=tom`)
        .expect(200);

      const searchedUser = response.body[0];

      expect(searchedUser).not.toHaveProperty("email");
      expect(searchedUser).not.toHaveProperty("lastLoggedIn");
      expect(searchedUser).not.toHaveProperty("moderator");
    });
  });

  describe("PUT /user/profilePicture", () => {
    it("should return 401 if user is not logged in", async () => {
      await request(app).put("/user/profilePicture").expect(401);
    });

    it("should return 400 if invalid profile picture is provided", async () => {
      await request(app).put("/user/profilePicture").send({ user }).expect(400);
      await request(app)
        .put("/user/profilePicture")
        .send({ user, profilePicture: "not a url" })
        .expect(400);
      await request(app)
        .put("/user/profilePicture")
        .send({ user, profilePicture: "https://imgur.com/test.png" })
        .expect(400);
    });

    it("should return 200 if valid profile picture is provided", async () => {
      await request(app)
        .put("/user/profilePicture")
        .send({ user, profilePicture: "https://i.imgur.com/2j1RdhZ.png" })
        .expect(200);

      const newUser = await User.findOne();
      expect(newUser?.profilePicture).toBe("https://i.imgur.com/2j1RdhZ.png");
    });
  });

  describe("PUT /user/profile", () => {
    it("should return 401 if user is not logged in", async () => {
      await request(app).put("/user/profile").expect(401);
    });

    it("should return 400 if invalid social links are provided", async () => {
      await request(app)
        .put("/user/profile")
        .send({
          user,
          instagram: "https://example.com/virus",
        })
        .expect(400);
      await request(app)
        .put("/user/profile")
        .send({
          user,
          twitter: "https://example.com/virus",
        })
        .expect(400);
      await request(app)
        .put("/user/profile")
        .send({
          user,
          facebook: "https://example.com/virus",
        })
        .expect(400);
    });

    it("should return 400 if invalid class year is provided", async () => {
      await request(app)
        .put("/user/profile")
        .send({
          user,
          classYear: "not a number",
        })
        .expect(400);

      await request(app)
        .put("/user/profile")
        .send({
          user,
          classYear: "2024.2",
        })
        .expect(400);
    });

    it("should return 200 if class year is .5er", async () => {
      await request(app)
        .put("/user/profile")
        .send({
          user,
          classYear: "2024.5",
        })
        .expect(200);

      const newUser = await User.findOne();
      expect(newUser?.classYear).toBe("2024.5");
    });

    it("should return 200 if valid bio is provided", async () => {
      await request(app)
        .put("/user/profile")
        .send({
          user,
          bio: "this is a bio",
        })
        .expect(200);

      const newUser = await User.findOne();
      expect(newUser?.bio).toBe("this is a bio");
    });

    it("should return 200 if many valid profile elements provided", async () => {
      await request(app)
        .put("/user/profile")
        .send({
          user,
          hometown: "San Francisco, CA",
          concentration: "Computer Science",
          classYear: "2024",
          instagram: "https://www.instagram.com/test",
          twitter: "https://twitter.com/test",
          facebook: "https://facebook.com/test",
          bio: "This is a bio",
        })
        .expect(200);

      const newUser = await User.findOne();
      expect(newUser?.concentration).toBe("Computer Science");
      expect(newUser?.classYear).toBe("2024");
      expect(newUser?.hometown).toBe("San Francisco, CA");
      expect(newUser?.instagram).toBe("https://www.instagram.com/test");
      expect(newUser?.twitter).toBe("https://twitter.com/test");
      expect(newUser?.facebook).toBe("https://facebook.com/test");
      expect(newUser?.bio).toBe("This is a bio");
    });

    it("should clear fields if undefined is provided", async () => {
      await request(app)
        .put("/user/profile")
        .send({
          user,
          hometown: "San Francisco, CA",
          concentration: "Computer Science",
          classYear: "2024",
          instagram: "https://instagram.com/test",
          twitter: "https://twitter.com/test",
          facebook: "https://facebook.com/test",
          bio: "This is a bio",
        })
        .expect(200);

      await request(app)
        .put("/user/profile")
        .send({
          user,
          hometown: undefined,
          concentration: undefined,
          classYear: undefined,
          instagram: undefined,
          twitter: undefined,
          facebook: undefined,
          bio: undefined,
        })
        .expect(200);

      const newUser = await User.findOne();
      expect(newUser?.concentration).toBe(null);
      expect(newUser?.classYear).toBe(null);
      expect(newUser?.hometown).toBe(null);
      expect(newUser?.instagram).toBe(null);
      expect(newUser?.twitter).toBe(null);
      expect(newUser?.facebook).toBe(null);
      expect(newUser?.bio).toBe(null);
    });
  });

  describe("POST /user/ban", () => {
    it("should return 401 if user is not logged in", async () => {
      await request(app).post("/user/ban").expect(401);
    });

    it("should return 401 if user is not moderator", async () => {
      await request(app).post("/user/ban").send({ user }).expect(401);
    });

    it("should return 404 if nonexistent target user is provided", async () => {
      const modUser = new User({
        googleId: 12345,
        name: "Mod",
        email: "mod@dearblueno.net",
        profilePicture: "https://i.imgur.com/removed.png",
        moderator: true,
      });
      await modUser.save();

      await request(app)
        .post("/user/ban")
        .send({ user: modUser, id: "5bb9e9f84186b222c8901149", duration: 10 })
        .expect(404);
    });

    it("should return 200 if valid target user is provided", async () => {
      const modUser = new User({
        googleId: 12345,
        name: "Mod",
        email: "mod@dearblueno.net",
        profilePicture: "https://i.imgur.com/removed.png",
        moderator: true,
      });
      await modUser.save();

      await request(app)
        .post("/user/ban")
        .send({ user: modUser, id: user._id, duration: 10 })
        .expect(200);

      const newUser = await User.findOne({ googleId: user.googleId });
      const time = new Date(newUser?.bannedUntil || 0);
      expect(new Date(time).getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe("GET /user/:id/comments", () => {
    it("should return 400 if invalid id is provided", async () => {
      await request(app).get("/user/12345/comments").expect(400);
    });

    it("should return 404 if nonexistent user is provided", async () => {
      await request(app)
        .get("/user/5bb9e9f84186b222c8901149/comments")
        .expect(404);
    });

    it("should return 200 if valid user is provided", async () => {
      const post = new Post({
        content: "This is a post",
        approved: true,
      });
      await post.save();

      const comment = new Comment({
        author: user._id,
        commentNumber: 1,
        parentCommentNumber: -1,
        post: post._id,
        postNumber: 1,
        content: "This is a comment",
        approved: true,
      });
      await comment.save();

      const response = await request(app).get(`/user/${user._id}/comments`);
      expect(response.body.length).toBe(1);
      expect(response.body[0].content).toBe("This is a comment");
    });

    it("should only return approved comments", async () => {
      const post = new Post({
        content: "This is a post",
        approved: true,
      });
      await post.save();

      const comment = new Comment({
        author: user._id,
        commentNumber: 1,
        parentCommentNumber: -1,
        post: post._id,
        postNumber: 1,
        content: "This is a comment",
        approved: false,
      });
      await comment.save();

      const response = await request(app).get(`/user/${user._id}/comments`);
      expect(response.body.length).toBe(0);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
