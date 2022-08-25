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
  if (!process.env.MONGODB_URI) {
    logger.fatal("Required environment variables are missing! Exiting...");
    process.exit(1);
  }

  // Setup MongoDB
  mongoConnection();

  // Setup Express server
  const server = express();
  server.use(responseTime());
  server.use(express.json());
  server.use(mongoSanitize());
  server.use(cors());
  server.use(session());
  server.use(cookieParser());
  server.use(connectLogger(logger));

  // Setup Passport.js
  passportConfig();
  server.use(passport.initialize());
  server.use(passport.session());

  // Setup status endpoint
  server.get("/", (_req, res) => res.send("Hello World! Dear Blueno API!"));

  // Setup API routes
  server.use("/posts", commentsRouter);
  server.use("/posts", postsRouter);
  server.use("/user", userRouter);
  server.use("/auth", authRouter);
  server.use("/events", eventsRouter);

  return server;
};
