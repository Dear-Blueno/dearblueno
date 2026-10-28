import log4js from "log4js";
import type { RequestHandler } from "express";

log4js.addLayout(
  "json",
  () => (event) =>
    JSON.stringify({
      timestamp: event.startTime.toISOString(),
      level: event.level.levelStr,
      category: event.categoryName,
      message: event.data.map((item: unknown) =>
        item instanceof Error ? item.message : item
      ),
    })
);
log4js.configure({
  appenders: { console: { type: "stdout", layout: { type: "json" } } },
  categories: { default: { appenders: ["console"], level: "info" } },
});

export default (logger: log4js.Logger): RequestHandler =>
  (req, res, next) => {
    const started = Date.now();
    res.on("finish", () =>
      logger.info({
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: Date.now() - started,
      })
    );
    next();
  };
