import expressSession from "express-session";
import type { RequestHandler } from "express";
import type { MongoClient } from "mongodb";
import MongoStore from "connect-mongo";
import mongoConnection from "./mongo";

export default function session(): RequestHandler {
  let client: MongoClient | undefined;
  let pending: Promise<RequestHandler> | undefined;
  return (req, res, next) => {
    void mongoConnection()
      .then(async (connection) => {
        const connectedClient = connection.connection.getClient();
        if (connectedClient !== client || !pending) {
          client = connectedClient;
          const store = MongoStore.create({ client, touchAfter: 24 * 60 * 60 });
          pending = store.collectionP.then(() =>
            expressSession({
              secret: process.env.SESSION_SECRET ?? "local-development-only",
              resave: false,
              saveUninitialized: false,
              store,
              cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24 * 30,
              },
            })
          );
        }
        const handler = await pending;
        handler(req, res, next);
      })
      .catch((error: unknown) => {
        pending = undefined;
        next(error);
      });
  };
}
