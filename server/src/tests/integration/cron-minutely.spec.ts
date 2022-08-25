import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import setupForTests from "../testUtil";
import User, { IUpcomingEventNotification, IUser } from "../../models/User";
import { minutelyJob } from "../../config/cron-minutely";
import Event from "../../models/Event";

describe("Cron Minutely", () => {
  let mongo: MongoMemoryServer;
  let user: IUser;

  beforeAll(async () => {
    const { db } = await setupForTests();
    mongo = db;
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();

    // Create a user
    const userModel = new User({
      googleId: "12345",
      name: "Blueno",
      profilePicture: "https://example.com/test.png",
      email: "blueno@dearblueno.net",
      verifiedBrown: true,
    });
    user = await userModel.save();
  });

  describe("Minutely Job", () => {
    it("should not send notifications if there are no events", async () => {
      await minutelyJob();

      const updatedUser = await User.findOne();
      expect(updatedUser?.notifications).toHaveLength(0);
    });

    it("should send notification if going to an event in 60 minutes", async () => {
      const event = new Event({
        eventName: "Test Event",
        eventDescription: "Test Description",
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: "Test Location",
        approved: true,
        going: [user._id],
      });
      await event.save();

      await minutelyJob();

      const updatedUser = await User.findOne();
      expect(updatedUser?.notifications).toHaveLength(1);
      const notification = updatedUser
        ?.notifications[0] as IUpcomingEventNotification;
      expect(notification.type).toBe("upcomingEvent");
      expect(notification.content.eventId.toString()).toBe(
        event._id.toString()
      );
      expect(notification.content.eventName).toBe(event.eventName);
      expect(notification.content.location).toBe(event.location);
      expect(notification.content.startDate).toStrictEqual(event.startDate);
      expect(notification.content.endDate).toStrictEqual(event.endDate);
    });

    it("should send notification if going to an event in less than 60 minutes", async () => {
      const event = new Event({
        eventName: "Test Event",
        eventDescription: "Test Description",
        startDate: new Date(Date.now() + 30 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 60 * 1000),
        location: "Test Location",
        approved: true,
        going: [user._id],
      });
      await event.save();

      await minutelyJob();

      const updatedUser = await User.findOne();
      expect(updatedUser?.notifications).toHaveLength(1);
      const notification = updatedUser
        ?.notifications[0] as IUpcomingEventNotification;
      expect(notification.type).toBe("upcomingEvent");
      expect(notification.content.eventId.toString()).toBe(
        event._id.toString()
      );
      expect(notification.content.eventName).toBe(event.eventName);
    });

    it("should not send duplicate notifications", async () => {
      const event = new Event({
        eventName: "Test Event",
        eventDescription: "Test Description",
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: "Test Location",
        approved: true,
        going: [user._id],
      });
      await event.save();

      await minutelyJob();

      await minutelyJob();

      const updatedUser = await User.findOne();
      expect(updatedUser?.notifications).toHaveLength(1);
    });

    it("should send notification if interested in an event in 60 minutes", async () => {
      const event = new Event({
        eventName: "Test Event",
        eventDescription: "Test Description",
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: "Test Location",
        approved: true,
        interested: [user._id],
      });
      await event.save();

      await minutelyJob();

      const updatedUser = await User.findOne();
      expect(updatedUser?.notifications).toHaveLength(1);
      const notification = updatedUser
        ?.notifications[0] as IUpcomingEventNotification;
      expect(notification.type).toBe("upcomingEvent");
      expect(notification.content.eventId.toString()).toBe(
        event._id.toString()
      );
      expect(notification.content.eventName).toBe(event.eventName);
    });

    it("should send multiple notifications if interested in multiple events", async () => {
      const event1 = new Event({
        eventName: "Test Event 1",
        eventDescription: "Test Description",
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: "Test Location",
        approved: true,
        interested: [user._id],
      });
      const event2 = new Event({
        eventName: "Test Event 2",
        eventDescription: "Test Description",
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: "Test Location",
        approved: true,
        interested: [user._id],
      });
      await Promise.all([event1.save(), event2.save()]);

      await minutelyJob();

      const updatedUser = await User.findOne();
      expect(updatedUser?.notifications).toHaveLength(2);
    });

    it("should send notifications to multiple users", async () => {
      const user2 = new User({
        googleId: "12345",
        name: "Joe",
        profilePicture: "https://example.com/test.png",
        email: "joe@dearblueno.net",
        verifiedBrown: true,
      });
      await user2.save();

      const event = new Event({
        eventName: "Test Event",
        eventDescription: "Test Description",
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: "Test Location",
        approved: true,
        going: [user._id, user2._id],
      });
      await event.save();

      await minutelyJob();

      const updatedUsers = await User.find({});
      expect(updatedUsers).toHaveLength(2);
      expect(updatedUsers[0]?.notifications).toHaveLength(1);
      expect(updatedUsers[1]?.notifications).toHaveLength(1);
    });

    it("should send notification while limiting to 100 notifications", async () => {
      const event = new Event({
        eventName: "Test Event",
        eventDescription: "Test Description",
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: "Test Location",
        approved: true,
        interested: [user._id],
      });
      await event.save();

      const user1 = await User.findOne();
      for (let i = 0; i < 100; i++) {
        user1?.notifications.push({
          type: "trendingPost",
          timestamp: new Date(),
          content: {
            postNumber: i,
            content: "Test Content",
          },
        });
      }
      await user1?.save();

      await minutelyJob();

      const updatedUser = await User.findOne();
      expect(updatedUser?.notifications).toHaveLength(100);
      const notification = updatedUser
        ?.notifications[99] as IUpcomingEventNotification;
      expect(notification.type).toBe("upcomingEvent");
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });
});
