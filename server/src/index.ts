import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import session from "express-session";
import responseTime from "response-time";
import passport from "passport";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import log4js from "log4js";

import mongoConnection from "./config/mongo";
import passportConfig from "./config/passport";
import setupDailyCron from "./config/cron-daily";
import setupHourlyCron from "./config/cron-hourly";
import setupMinutelyCron from "./config/cron-minutely";

import postsRouter from "./routes/posts";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import eventsRouter from "./routes/events";

// Setup logger
log4js.configure({
  appenders: {
    console: { type: "stdout" },
    file: {
      type: "dateFile",
      filename: "logs/app.log",
      compress: true,
      keepFileExt: true,
    },
  },
  categories: {
    default: { appenders: ["console", "file"], level: "info" },
  },
});
const logger = log4js.getLogger("app");

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();
if (!process.env.MONGODB_URI) {
  logger.fatal("Required environment variables are missing! Exiting...");
  process.exit(1);
}

// Setup Passport.js
passportConfig();

// Setup Express server
const app = express();
app.use(responseTime());
app.use(express.json());
app.use(mongoSanitize());
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(
  log4js.connectLogger(logger, {
    level: "auto",
    format: ":method :url :status :content-length - :response-time ms",
    statusRules: [
      { from: 200, to: 399, level: "info" },
      { from: 400, to: 499, level: "warn" },
      { from: 500, to: 599, level: "error" },
    ],
  })
);

// Setup MongoDB
mongoConnection();

// Express session cookie
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  })
);
app.use(cookieParser());

// Connect Passport.js to Express
app.use(passport.initialize());
app.use(passport.session());

// Setup basic GET request
app.get("/", (_req, res) => {
  res.send("Hello World! Dear Blueno API!");
});

// Setup API routes
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/events", eventsRouter);

// Setup cron jobs
setupDailyCron();
setupHourlyCron();
setupMinutelyCron();

// Start Express server
const port = process.env.PORT ?? 5000;
app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
