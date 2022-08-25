import log4js from "log4js";
import app from "./app";

import setupDailyCron from "./config/cron-daily";
import setupHourlyCron from "./config/cron-hourly";
import setupMinutelyCron from "./config/cron-minutely";

const logger = log4js.getLogger();
const server = app();

// Setup cron jobs
setupDailyCron();
setupHourlyCron();
setupMinutelyCron();

// Start Express server
const port = process.env.PORT ?? 5000;
server.listen(port, () => {
  logger.info(
    `Server listening on port ${port}. Running in ${process.env.NODE_ENV} mode.`
  );
});
