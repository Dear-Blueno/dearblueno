import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

export default () =>
  session({
    secret: process.env.SESSION_SECRET ?? "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  });
