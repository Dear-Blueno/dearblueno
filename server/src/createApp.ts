import dotenv from "dotenv";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import responseTime from "response-time";
import passport from "passport";
import cookieParser from "cookie-parser";
import log4js from "log4js";

import connectLogger from "./config/logger";
import session from "./config/session";
import cors from "./config/cors";
import mongoConnection from "./config/mongo";
import passportConfig from "./config/passport";
import validateEnvironment from "./config/environment";
import jobsRouter from "./routes/jobs";
import "express-async-errors";

import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comments";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import eventsRouter from "./routes/events";

export default () => {
  // Setup logger
  const logger = log4js.getLogger("app");

  // Load environment variables from .env file, where API keys and passwords are configured
  dotenv.config();
  validateEnvironment();

  // Setup Express server
  const server = express();
  server.set("trust proxy", 1);
  server.use(connectLogger(logger));
  server.use((req, res, next) => {
    if (
      process.env.MAINTENANCE_MODE === "true" &&
      !req.path.startsWith("/internal/")
    ) {
      res
        .status(503)
        .set("Retry-After", "1800")
        .json({ error: "Maintenance in progress" });
      return;
    }
    mongoConnection().then(() => next(), next);
  });
  server.use(responseTime());
  server.use(express.json());
  server.use(mongoSanitize());
  server.use(cors());
  server.use(session());
  server.use(cookieParser());

  // Setup Passport.js
  passportConfig();
  server.use(passport.initialize());
  server.use(passport.session());

  // Setup status endpoint
  server.get("/", (_req, res) => res.send("Hello World! Dear Blueno API!"));

  server.use("/internal/jobs", jobsRouter);

  // Setup API routes
  server.use("/posts", commentsRouter);
  server.use("/posts", postsRouter);
  server.use("/user", userRouter);
  server.use("/auth", authRouter);
  server.use("/events", eventsRouter);

  server.use(((error, _req, res, _next) => {
    void _next;
    logger.error(error);
    if (!res.headersSent)
      res.status(500).json({ error: "Internal server error" });
  }) as express.ErrorRequestHandler);

  return server;
};
