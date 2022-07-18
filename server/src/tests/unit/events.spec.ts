import { Express } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../../models/User";
import Event from "../../models/Event";
import request from "supertest";
import setupForTests, { resetCollections } from "../testUtil";

describe("Events", () => {
  let app: Express;
  let user: IUser;
  let modUser: IUser;

  beforeAll(async () => {
    app = await setupForTests();
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

  describe("GET /events", () => {
    it("should return a list of events", async () => {
      await new Event({
        eventName: "Event 1",
        eventDescription: "Event 1 description",
        startDate: new Date(Date.now() + 1000 * 10),
        endDate: new Date(Date.now() + 1000 * 20),
        location: "Event 1 location",
        approved: true,
      }).save();
      await new Event({
        eventName: "Event 2",
        eventDescription: "Event 2 description",
        startDate: new Date(Date.now() + 1000 * 30),
        endDate: new Date(Date.now() + 1000 * 40),
        location: "Event 2 location",
        approved: true,
      }).save();

      const res = await request(app).get("/events").expect(200);
      expect(res.body.length).toBe(2);

      const event1 = res.body[0];
      expect(event1.eventName).toBe("Event 1");
      expect(event1.eventDescription).toBe("Event 1 description");
      expect(event1.location).toBe("Event 1 location");
      expect(event1.startDate).toBeDefined();
      expect(event1.endDate).toBeDefined();

      const event2 = res.body[1];
      expect(event2.eventName).toBe("Event 2");
      expect(event2.eventDescription).toBe("Event 2 description");
      expect(event2.location).toBe("Event 2 location");
      expect(event2.startDate).toBeDefined();
      expect(event2.endDate).toBeDefined();
    });

    it("should return a list of events in order of closest startTime", async () => {
      await new Event({
        eventName: "Distant Event",
        eventDescription: "This event is a year away",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        endDate: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 365 + 1000 * 60 * 60
        ),
        location: "Distant Event location",
        approved: true,
      }).save();
      await new Event({
        eventName: "Fairly Close Event",
        eventDescription: "This event is a day away",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 + 1000 * 60 * 60),
        location: "Fairly Close Event location",
        approved: true,
      }).save();
      await new Event({
        eventName: "Next Week Event",
        eventDescription: "This event is a week away",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        endDate: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60
        ),
        location: "Next Week Event location",
        approved: true,
      }).save();
      await new Event({
        eventName: "Already Started Event",
        eventDescription: "This event is already started",
        startDate: new Date(Date.now() - 1000 * 60),
        endDate: new Date(Date.now() + 1000 * 60 * 60),
        location: "Already Started Event location",
        approved: true,
      }).save();
      await new Event({
        eventName: "Next Month Event",
        eventDescription: "This event is a month away",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        endDate: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 60
        ),
        location: "Next Month Event location",
        approved: true,
      }).save();
      await new Event({
        eventName: "An Hour Away Event",
        eventDescription: "This event is an hour away",
        startDate: new Date(Date.now() + 1000 * 60 * 60),
        endDate: new Date(Date.now() + 1000 * 60 * 60 + 1000 * 60 * 60),
        location: "An Hour Away Event location",
        approved: true,
      }).save();

      const res = await request(app).get("/events").expect(200);
      expect(res.body.length).toBe(6);

      const event0 = res.body[0];
      expect(event0.eventName).toBe("Already Started Event");
      expect(event0.eventDescription).toBe("This event is already started");

      const event1 = res.body[1];
      expect(event1.eventName).toBe("An Hour Away Event");
      expect(event1.eventDescription).toBe("This event is an hour away");

      const event2 = res.body[2];
      expect(event2.eventName).toBe("Fairly Close Event");
      expect(event2.eventDescription).toBe("This event is a day away");

      const event3 = res.body[3];
      expect(event3.eventName).toBe("Next Week Event");

      const event4 = res.body[4];
      expect(event4.eventName).toBe("Next Month Event");

      const event5 = res.body[5];
      expect(event5.eventName).toBe("Distant Event");
    });

    it("should only return events that are approved", async () => {
      await new Event({
        eventName: "Event 1",
        eventDescription: "Event 1 description",
        startDate: new Date(Date.now() + 1000 * 10),
        endDate: new Date(Date.now() + 1000 * 20),
        location: "Event 1 location",
        approved: true,
      }).save();
      await new Event({
        eventName: "Event 2",
        eventDescription: "Event 2 description",
        startDate: new Date(Date.now() + 1000 * 30),
        endDate: new Date(Date.now() + 1000 * 40),
        location: "Event 2 location",
        approved: false,
      }).save();

      const res = await request(app).get("/events").expect(200);
      expect(res.body.length).toBe(1);

      const event1 = res.body[0];
      expect(event1.eventName).toBe("Event 1");
      expect(event1.eventDescription).toBe("Event 1 description");
      expect(event1.location).toBe("Event 1 location");
      expect(event1.startDate).toBeDefined();
      expect(event1.endDate).toBeDefined();
    });

    it("should not return events with endDate in the past", async () => {
      await new Event({
        eventName: "Event 1",
        eventDescription: "Event 1 description",
        startDate: new Date(Date.now() - 1000 * 10),
        endDate: new Date(Date.now() + 1000 * 10),
        location: "Event 1 location",
        approved: true,
      }).save();
      await new Event({
        eventName: "Event 2",
        eventDescription: "Event 2 description",
        startDate: new Date(Date.now() - 1000 * 60),
        endDate: new Date(Date.now() - 1000 * 30),
        location: "Event 2 location",
        approved: true,
      }).save();

      const res = await request(app).get("/events").expect(200);
      expect(res.body.length).toBe(1);

      const event1 = res.body[0];
      expect(event1.eventName).toBe("Event 1");
    });

    it("should not display more than 10 events per page", async () => {
      for (let i = 0; i < 15; i++) {
        await new Event({
          eventName: `Event ${i}`,
          eventDescription: `Event ${i} description`,
          startDate: new Date(Date.now() + 1000 * 10),
          endDate: new Date(Date.now() + 1000 * 20),
          location: `Event ${i} location`,
          approved: true,
        }).save();
      }

      const res = await request(app).get("/events").expect(200);
      expect(res.body.length).toBe(10);
    });

    it("should return paginated list when page is specified", async () => {
      for (let i = 0; i < 15; i++) {
        await new Event({
          eventName: `Event ${i}`,
          eventDescription: `Event ${i} description`,
          startDate: new Date(Date.now() + 1000 * 10),
          endDate: new Date(Date.now() + 1000 * 20),
          location: `Event ${i} location`,
          approved: true,
        }).save();
      }

      const res = await request(app).get("/events?page=2").expect(200);
      expect(res.body.length).toBe(5);

      const event1 = res.body[0];
      expect(event1.eventName).toBe("Event 10");

      const event5 = res.body[4];
      expect(event5.eventName).toBe("Event 14");
    });

    it("should not include sensitive information of events", async () => {
      await new Event({
        eventName: "Event 1",
        eventDescription: "Event 1 description",
        startDate: new Date(Date.now() + 1000 * 10),
        endDate: new Date(Date.now() + 1000 * 20),
        location: "Event 1 location",
        approved: true,
        approvedBy: modUser._id,
      }).save();

      const res = await request(app).get("/events").expect(200);
      expect(res.body.length).toBe(1);

      const event1 = res.body[0];
      expect(event1.approvedBy).toBeUndefined();
    });

    it("should not include user ids besides the requesting user", async () => {
      await new Event({
        eventName: "Event 1",
        eventDescription: "Event 1 description",
        startDate: new Date(Date.now() + 1000 * 10),
        endDate: new Date(Date.now() + 1000 * 20),
        location: "Event 1 location",
        approved: true,
        interested: [user._id, modUser._id],
        going: [user._id, modUser._id],
      }).save();

      const res = await request(app).get("/events").send({ user }).expect(200);
      expect(res.body.length).toBe(1);

      const event1 = res.body[0];
      expect(event1.interested).toHaveLength(2);
      expect(event1.interested).toContain(user._id.toString());
      expect(event1.interested).not.toContain(modUser._id.toString());
      expect(event1.going).toHaveLength(2);
      expect(event1.going).toContain(user._id.toString());
      expect(event1.going).not.toContain(modUser._id.toString());
    });
  });

  describe("GET /events/all", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).get("/events/all").expect(401);
    });

    it("should return 401 if not a moderator", async () => {
      await request(app).get("/events/all").send({ user }).expect(401);
    });

    it("should return all events", async () => {
      await new Event({
        eventName: "Unapproved Event",
        eventDescription: "Event 1 description",
        startDate: new Date(Date.now() + 1000 * 20),
        endDate: new Date(Date.now() + 1000 * 30),
        location: "Event 1 location",
        approved: false,
      }).save();
      await new Event({
        eventName: "Past Event",
        eventDescription: "Event 2 description",
        startDate: new Date(Date.now() - 1000 * 30),
        endDate: new Date(Date.now() - 1000 * 20),
        location: "Event 2 location",
        approved: true,
      }).save();
      await new Event({
        eventName: "Regular Event",
        eventDescription: "Event 3 description",
        startDate: new Date(Date.now() + 1000 * 10),
        endDate: new Date(Date.now() + 1000 * 20),
        location: "Event 3 location",
        approved: true,
      }).save();

      const res = await request(app)
        .get("/events/all")
        .send({ user: modUser })
        .expect(200);
      expect(res.body.length).toBe(3);

      const event1 = res.body[0];
      expect(event1.eventName).toBe("Past Event");

      const event2 = res.body[1];
      expect(event2.eventName).toBe("Regular Event");

      const event3 = res.body[2];
      expect(event3.eventName).toBe("Unapproved Event");
    });
  });

  describe("GET /events/mod-feed", () => {
    it("should return 401 if not logged in", async () => {
      await request(app).get("/events/mod-feed").expect(401);
    });

    it("should return 401 if not a moderator", async () => {
      await request(app).get("/events/mod-feed").send({ user }).expect(401);
    });

    it("should return events that need review", async () => {
      await new Event({
        eventName: "Event 1",
        eventDescription: "Event 1 description",
        startDate: new Date(Date.now() + 1000 * 10),
        endDate: new Date(Date.now() + 1000 * 20),
        location: "Event 1 location",
      }).save();
      await new Event({
        eventName: "Event 2",
        eventDescription: "Event 2 description",
        startDate: new Date(Date.now() + 1000 * 10),
        endDate: new Date(Date.now() + 1000 * 20),
        location: "Event 2 location",
        approved: true,
        needsReview: false,
      }).save();
      await new Event({
        eventName: "Event 3",
        eventDescription: "Event 3 description",
        startDate: new Date(Date.now() + 1000 * 10),
        endDate: new Date(Date.now() + 1000 * 20),
        location: "Event 3 location",
        approved: true,
        needsReview: true,
      }).save();

      const res = await request(app)
        .get("/events/mod-feed")
        .send({ user: modUser })
        .expect(200);
      expect(res.body.length).toBe(2);

      const event1 = res.body[0];
      expect(event1.eventName).toBe("Event 1");

      const event2 = res.body[1];
      expect(event2.eventName).toBe("Event 3");
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
