import { Router } from "express";
import { body, param, query } from "express-validator";
import { IUser } from "../models/User";
import { authCheck, modCheck, optionalAuth } from "../middleware/auth";
import Event, { IEvent } from "../models/Event";
import { Document } from "mongoose";
import { validate } from "../middleware/validate";

const eventRouter = Router();

// Cleans the sensitive data from the event object, replacing interested array with the number of interested
function cleanSensitiveEvent(event: IEvent, user?: IUser): IEvent {
  const interested = event.interested.map((id) =>
    String(id) == String(user?._id) ? id : "anon"
  );
  const going = event.going.map((id) =>
    String(id) == String(user?._id) ? id : "anon"
  );

  return {
    ...event,
    interested,
    going,
  };
}

// GET request that gets 10 events paginated in order of closest startDate (only approved events)
eventRouter.get(
  "/",
  authCheck,
  query("page").optional().isInt({ min: 1 }),
  validate,
  async (req, res) => {
    const page = Number(req.query.page) || 1;
    const events = await Event.find({
      approved: true,
      endDate: { $gte: new Date() },
    })
      .sort({ startDate: 1 })
      .skip((page - 1) * 10)
      .limit(10)
      .select("-approvedBy -notificationSent");

    const cleanEvents = events.map((event: IEvent & Document) =>
      cleanSensitiveEvent(event.toObject(), req.user as IUser)
    );

    res.send(cleanEvents);
  }
);

// GET request that gets 10 events paginated in order of closest startDate (all events)
// (Must be authenticated as a moderator)
eventRouter.get(
  "/all",
  modCheck,
  query("page").optional().isInt({ min: 1 }),
  validate,
  async (req, res) => {
    const page = Number(req.query.page) || 1;
    const events = await Event.find()
      .sort({ startDate: 1 })
      .skip((page - 1) * 10)
      .limit(10);

    res.send(events);
  }
);

// GET request that gets 10 posts paginated in order of oldest postTime (only events that need review)
// (Must be authenticated as a moderator)
eventRouter.get(
  "/mod-feed",
  modCheck,
  query("page").optional().isInt({ min: 1 }),
  validate,
  async (req, res) => {
    const page = Number(req.query.page) || 1;
    const events = await Event.find({
      needsReview: true,
    })
      .sort({ postTime: 1 })
      .skip((page - 1) * 10)
      .limit(10);

    res.send(events);
  }
);

// GET request that returns only the cleansed reactions of a page of events
eventRouter.get(
  "/reactions",
  authCheck,
  query("page").optional().isInt({ min: 1 }),
  validate,
  async (req, res) => {
    const page = Number(req.query.page) || 1;
    const events = await Event.find({
      approved: true,
      endDate: { $gte: new Date() },
    })
      .sort({ startDate: 1 })
      .skip((page - 1) * 10)
      .limit(10)
      .select("going interested");

    const cleanEvents = events.map((event: IEvent & Document) =>
      cleanSensitiveEvent(event.toObject(), req.user as IUser)
    );

    res.send(cleanEvents);
  }
);

// GET request that gets a single event by id (only approved events)
eventRouter.get(
  "/:id",
  optionalAuth,
  param("id").isMongoId(),
  validate,
  async (req, res) => {
    const event = await Event.findById(req.params.id).select(
      "-approvedBy -notificationSent"
    );
    if (!event || !event.approved) {
      res.status(404).send("Event not found");
      return;
    }

    const cleanEvent = cleanSensitiveEvent(event.toObject(), req.user as IUser);

    res.send(cleanEvent);
  }
);

// GET request that returns only the cleansed reactions of a single event
eventRouter.get(
  "/:id/reactions",
  authCheck,
  param("id").isMongoId(),
  validate,
  async (req, res) => {
    const event = await Event.findById(req.params.id).select(
      "approved going interested"
    );
    if (!event || !event.approved) {
      res.status(404).send("Event not found");
      return;
    }

    const cleanEvent = cleanSensitiveEvent(event.toObject(), req.user as IUser);

    res.send(cleanEvent);
  }
);

// POST request that creates a new event
eventRouter.post(
  "/",
  authCheck,
  body("eventName").isString().trim().isLength({ min: 1, max: 65 }),
  body("eventDescription").isString().trim().isLength({ min: 1, max: 800 }),
  body("startDate").isISO8601().toDate().isAfter(new Date().toString()),
  body("endDate")
    .isISO8601()
    .toDate()
    .isAfter(new Date().toString())
    .custom((value, { req }) => {
      if (value <= req.body.startDate) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("location").isString().trim().isLength({ min: 1, max: 65 }),
  body("contactEmail").optional().trim().isEmail().normalizeEmail(),
  body("coverPicture")
    .optional()
    .trim()
    .isURL({
      require_protocol: true,
      protocols: ["https"],
      host_whitelist: ["i.imgur.com"],
    }),
  validate,
  async (req, res) => {
    const event = new Event({
      eventName: req.body.eventName,
      eventDescription: req.body.eventDescription,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      location: req.body.location,
      contactEmail: req.body.contactEmail,
      coverPicture: req.body.coverPicture,
    });
    await event.save();
    res.send(event);
  }
);

// PUT request that updates an event's approved status
// (Must be authenticated as a moderator)
eventRouter.put(
  "/:id/approve",
  modCheck,
  param("id").isMongoId(),
  body("approved").isBoolean(),
  validate,
  async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).send("Event not found");
      return;
    }

    event.approved = req.body.approved;
    event.needsReview = false;
    event.approvedBy = (req.user as IUser)._id;
    event.approvedTime = new Date();
    await event.save();
    res.send(event);
  }
);

// PUT request that marks an event as 'interested'
eventRouter.put(
  "/:id/interested",
  authCheck,
  param("id").isMongoId(),
  body("interested").toBoolean(),
  validate,
  async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event || !event.approved) {
      res.status(404).send("Event not found");
      return;
    }

    const interested = req.body.interested;
    const user = req.user as IUser;

    if (interested && !event.interested.includes(user._id)) {
      event.interested.push(user._id);
    } else if (!interested && event.interested.includes(user._id)) {
      event.interested.splice(event.interested.indexOf(user._id), 1);
    }
    await event.save();

    res.json({ interested: interested });
  }
);

// PUT request that marks an event as 'going'
eventRouter.put(
  "/:id/going",
  authCheck,
  param("id").isMongoId(),
  body("going").toBoolean(),
  validate,
  async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event || !event.approved) {
      res.status(404).send("Event not found");
      return;
    }

    const going = req.body.going;
    const user = req.user as IUser;

    if (going && !event.going.includes(user._id)) {
      event.going.push(user._id);
    } else if (!going && event.going.includes(user._id)) {
      event.going.splice(event.going.indexOf(user._id), 1);
    }
    await event.save();

    res.json({ going: going });
  }
);

export default eventRouter;
