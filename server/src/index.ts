import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import { mongoConnection } from "./config/mongo";
import passportConfig from "./config/passport";

import postsRouter from "./routes/posts";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Setup Passport.js
passportConfig();

// Setup Express server
const app = express();
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

// Start Express server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
