import cors from "cors";

export default () =>
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  });
