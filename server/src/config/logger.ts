import log4js from "log4js";
import { RequestHandler } from "express";

log4js.configure({
  appenders: {
    console: { type: "stdout" },
    file: {
      type: "dateFile",
      filename: "logs/app.log",
      compress: true,
      keepFileExt: true,
      numBackups: 180,
    },
  },
  categories: {
    default: { appenders: ["console", "file"], level: "info" },
  },
});

export default (logger: log4js.Logger) =>
  log4js.connectLogger(logger, {
    level: "auto",
    format: ":method :url :status :content-length - :response-time ms",
    statusRules: [
      { from: 200, to: 399, level: "info" },
      { from: 400, to: 499, level: "warn" },
      { from: 500, to: 599, level: "error" },
    ],
  }) as RequestHandler;
