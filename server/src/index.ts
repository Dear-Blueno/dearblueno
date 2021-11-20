import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";

import { mongoConnection } from "./config/mongo";

import postsRouter from "./routes/posts";
import userRouter from "./routes/user";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: path.resolve(__dirname, "../.env") });

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

// TODO: Use Passport.js to handle authentication

mongoConnection();

// TODO: Express session for cookies

// Setup basic GET request
app.get("/", (_req, res) => {
  res.send("Hello World! Dear Blueno API!");
});

// Setup API routes
app.use("/posts", postsRouter);
app.use("/user", userRouter);

// Start Express server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
