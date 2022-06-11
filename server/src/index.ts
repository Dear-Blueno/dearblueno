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

import postsRouter from "./routes/posts";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";

// Setup logger
log4js.configure({
  appenders: {
    out: { type: "stdout" },
    app: { type: "file", filename: "logs/app.log" },
  },
  categories: {
    default: { appenders: ["out", "app"], level: "info" },
  },
});
const logger = log4js.getLogger("app");

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();

if (process.env.MONGODB_URI === undefined) {
  logger.fatal("MONGODB_URI is not defined in environment variables");
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
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Setup MongoDB
mongoConnection();

// Express session cookie
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
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

// Setup cron jobs
setupDailyCron();
setupHourlyCron();

// Start Express server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
