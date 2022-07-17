import { Router } from "express";
import { param, query, validationResult } from "express-validator";
import { IUser } from "../models/User";
import { modCheck, optionalAuth } from "../middleware/auth";
import Event, { IEvent } from "../models/Event";
import { Document } from "mongoose";

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
  optionalAuth,
  query("page").optional().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = Number(req.query?.page) || 1;
    const events = await Event.find({
      approved: true,
      endDate: { $gte: new Date() },
    })
      .sort({ startDate: 1 })
      .skip((page - 1) * 10)
      .limit(10)
      .select("-approvedBy");

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = Number(req.query?.page) || 1;
    const events = await Event.find()
      .sort({ startDate: 1 })
      .skip((page - 1) * 10)
      .limit(10);

    res.send(events);
  }
);

// GET request that gets 10 posts paginated in order of oldest postDate (only events that need review)
// (Must be authenticated as a moderator)
eventRouter.get(
  "/mod-feed",
  modCheck,
  query("page").optional().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = Number(req.query?.page) || 1;
    const events = await Event.find({
      needsReview: true,
    })
      .sort({ postTime: -1 })
      .skip((page - 1) * 10)
      .limit(10);

    res.send(events);
  }
);

// GET request that gets a single event by id (only approved events)
eventRouter.get(
  "/:id",
  optionalAuth,
  param("id").isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const event = await Event.findById(req.params.id).select("-approvedBy");
    if (!event || !event.approved) {
      res.status(404).send("Event not found");
      return;
    }

    const cleanEvent = cleanSensitiveEvent(event.toObject(), req.user as IUser);

    res.send(cleanEvent);
  }
);

export default eventRouter;
