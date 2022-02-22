import cron from "node-cron";
import { GoogleSpreadsheet } from "google-spreadsheet";
import User from "../models/User";
import Post from "../models/Post";
import log4js from "log4js";

const logger = log4js.getLogger("cron");

export default async function setupCron() {
  // Hourly, import posts from Google Sheets
  cron.schedule("30 * * * *", async () => {
    const startDate = new Date();
    logger.info("Running hourly cron job! 🚀");

    await hourlyJob();

    const endDate = new Date();
    logger.info("Hourly cron job completed! 🎉");
    const completedIn = endDate.getTime() - startDate.getTime();
    logger.info(`Completed in ${completedIn}ms`);
  });

  // Daily at midnight, handle daily streak related stuff
  cron.schedule("0 0 * * *", async () => {
    const startDate = new Date();
    logger.info("Running daily cron job! 🚀");

    await dailyJob();

    const endDate = new Date();
    logger.info("Daily cron job completed! 🎉");
    const completedIn = endDate.getTime() - startDate.getTime();
    logger.info(`Completed in ${completedIn}ms`);
  });
}

export async function hourlyJob() {
  try {
    // Setup connection to google spreadsheet
    const creds = {
      client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL || "",
      private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY || "",
    };

    const verifiedDoc = new GoogleSpreadsheet(
      process.env.VERIFIED_GOOGLE_SHEET_ID
    );
    await verifiedDoc.useServiceAccountAuth(creds);
    logger.debug("Connected to verified google sheet");

    const unverifiedDoc = new GoogleSpreadsheet(
      process.env.UNVERIFIED_GOOGLE_SHEET_ID
    );
    await unverifiedDoc.useServiceAccountAuth(creds);
    logger.debug("Connected to unverified google sheet");

    // Load from verified document
    await verifiedDoc.loadInfo();
    const verifiedSheet = verifiedDoc.sheetsByIndex[0];
    const verifiedRows = await verifiedSheet.getRows();
    logger.debug("Loaded verified rows");

    // For all rows in the sheet
    for (const row of verifiedRows) {
      // Skip if the row is empty
      if (row._rawData.length === 0) continue;

      // Create a post from the row
      const postTime = new Date(row.Timestamp);
      const content = row.Post;
      const post = new Post({
        content,
        postTime,
        verifiedBrown: true,
      });
      await post.save();
    }

    logger.debug("Loaded verified posts");

    // Clear the sheet
    await verifiedSheet.clear();
    await verifiedSheet.loadCells("A1:B1");
    verifiedSheet.getCellByA1("A1").value = "Timestamp";
    verifiedSheet.getCellByA1("B1").value = "Post";
    await verifiedSheet.saveUpdatedCells();
    logger.debug("Cleared verified sheet");

    // Load from unverified document
    await unverifiedDoc.loadInfo();
    const unverifiedSheet = unverifiedDoc.sheetsByIndex[0];
    const unverifiedRows = await unverifiedSheet.getRows();
    logger.debug("Loaded unverified rows");
    // For all rows in the sheet
    for (const row of unverifiedRows) {
      // Skip if the row is empty
      if (row._rawData.length === 0) continue;

      // Create a post from the row
      const postTime = new Date(row.Timestamp);
      const content = row.Post;
      const post = new Post({
        content,
        postTime,
        verifiedBrown: false,
      });
      await post.save();
    }

    logger.debug("Loaded unverified posts");

    // Clear the sheet
    await unverifiedSheet.clear();
    await unverifiedSheet.loadCells("A1:B1");
    unverifiedSheet.getCellByA1("A1").value = "Timestamp";
    unverifiedSheet.getCellByA1("B1").value = "Post";
    await unverifiedSheet.saveUpdatedCells();
    logger.debug("Cleared unverified sheet");
  } catch (err) {
    logger.error(err);
  }
}

export async function dailyJob() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Reset streaks for users that have not logged in today
  await User.updateMany(
    {
      $and: [{ lastLoggedIn: { $lt: yesterday } }, { streakDays: { $gt: 0 } }],
    },
    {
      $set: {
        streakDays: 0,
      },
    }
  );

  // Increment streaks for users that have logged in today
  await User.updateMany(
    {
      lastLoggedIn: { $gte: yesterday },
    },
    {
      $inc: {
        streakDays: 1,
      },
    }
  );

  // Award xp to users that have a streak at multiple of 3 days
  // 5 xp every 3 days for streaks up to streak of 15 days
  await User.updateMany(
    {
      streakDays: { $mod: [3, 0], $gt: 0, $lt: 15 },
    },
    {
      $inc: {
        xp: 5,
      },
    }
  );

  // Starting at 15 days, award 10 xp every 3 days
  await User.updateMany(
    {
      streakDays: { $mod: [3, 0], $gte: 15 },
    },
    {
      $inc: {
        xp: 10,
      },
    }
  );

  // Award a "One Week Streak" badge for streaks of 7 days
  await User.updateMany(
    {
      $and: [{ streakDays: 7 }, { badges: { $nin: ["One Week Streak"] } }],
    },
    {
      $push: {
        badges: "One Week Streak",
      },
    }
  );

  // Award a "One Month Streak" badge for streaks of 30 days
  await User.updateMany(
    {
      $and: [{ streakDays: 30 }, { badges: { $nin: ["One Month Streak"] } }],
    },
    {
      $push: {
        badges: "One Month Streak",
      },
    }
  );

  // Award a "Nice" badge for streaks of 69 days
  await User.updateMany(
    {
      $and: [{ streakDays: 69 }, { badges: { $nin: ["Nice"] } }],
    },
    {
      $push: {
        badges: "Nice",
      },
    }
  );

  // Award a "One Year Streak" badge for streaks of 365 days
  await User.updateMany(
    {
      $and: [{ streakDays: 365 }, { badges: { $nin: ["One Year Streak"] } }],
    },
    {
      $push: {
        badges: "One Year Streak",
      },
    }
  );

  // Remove the "Top Fan" badge from all users
  await User.updateMany(
    {
      badges: "Top Fan",
    },
    {
      $pull: {
        badges: "Top Fan",
      },
    }
  );

  // Award a "Top Fan" badge to users in the top 5% of xp
  const count = await User.count();
  // Find the xp of the user at the 5th percentile
  const user5th = await User.findOne({}, { xp: 1, _id: 0 })
    .sort({ xp: -1 })
    .skip(Math.floor(count * 0.05));
  const minXp = Math.max(user5th ? user5th.xp : 9, 9) + 1;
  // Award the "Top Fan" badge to all users with xp >= the 5th percentile xp
  await User.updateMany(
    {
      xp: { $gte: minXp },
    },
    {
      $push: {
        badges: "Top Fan",
      },
    }
  );
}
