import { Express } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import setupForTests from "../testUtil";

describe("Auth", () => {
  let mongo: MongoMemoryServer;
  let app: Express;

  beforeAll(async () => {
    const { server, db } = await setupForTests();
    app = server;
    mongo = db;
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  describe("GET /auth", () => {
    it("should return 204 if no user is authenticated", async () => {
      const res = await request(app).get("/auth").expect(204);
      expect(res.body.loggedIn).toBeFalsy();
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop(true);
  });
});
