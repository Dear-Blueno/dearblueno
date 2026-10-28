import express from "express";
import createApp from "./createApp";

// Vercel detects this module and manages the HTTP listener.
const app: express.Express = createApp();
export default app;
