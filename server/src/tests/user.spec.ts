import { Express } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../models/User";
import request from "supertest";
import setupForTests from "./testUtil";

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
      await request(app).get("/user/1").expect(404);
    });

    it("should return user if user is found", async () => {
      const response = await request(app)
        .get(`/user/${user.googleId}`)
        .expect(200);
      expect(response.body.user.name).toBe(user.name);
      expect(response.body.user.profilePicture).toBe(user.profilePicture);
    });

    it("should return not reveal sensitive information", async () => {
      const response = await request(app).get(`/user/${user.googleId}`);
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
      await request(app).get("/user/search?name=12345").expect(400);
    });

    it("should return user if user is found", async () => {
      const response = await request(app)
        .get(`/user/search?name=tom`)
        .expect(200);
      expect(response.body.users.length).toBe(1);
      expect(response.body.users[0].name).toBe("Tom");
    });

    it("should return not reveal sensitive information", async () => {
      const response = await request(app)
        .get(`/user/search?name=tom`)
        .expect(200);
      expect(response.body).toHaveProperty("users");

      const searchedUser = response.body.users[0];

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
        .send({ user, instagram: "https://example.com/virus" })
        .expect(400);
      await request(app)
        .put("/user/profile")
        .send({ user, twitter: "https://example.com/virus" })
        .expect(400);
      await request(app)
        .put("/user/profile")
        .send({ user, facebook: "https://example.com/virus" })
        .expect(400);
    });

    it("should return 400 if invalid class year is provided", async () => {
      await request(app)
        .put("/user/profile")
        .send({ user, classYear: "not a number" })
        .expect(400);
    });

    it("should return 200 if valid bio is provided", async () => {
      await request(app)
        .put("/user/profile")
        .send({ user, bio: "this is a bio" })
        .expect(200);

      const newUser = await User.findOne();
      expect(newUser?.bio).toBe("this is a bio");
    });

    it("should return 200 if many valid profile elements provided", async () => {
      await request(app)
        .put("/user/profile")
        .send({
          user,
          concentration: "Computer Science",
          classYear: "2024",
          instagram: "https://instagram.com/test",
          twitter: "https://twitter.com/test",
          facebook: "https://facebook.com/test",
        })
        .expect(200);

      const newUser = await User.findOne();
      expect(newUser?.concentration).toBe("Computer Science");
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
