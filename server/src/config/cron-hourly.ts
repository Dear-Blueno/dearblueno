import cron from "node-cron";
import { GoogleSpreadsheet } from "google-spreadsheet";
import Post from "../models/Post";
import log4js from "log4js";

const logger = log4js.getLogger("cron-hourly");

export default function setupCron() {
  // Hourly, import posts from Google Sheets
  cron.schedule("30 * * * *", async () => {
    const startDate = new Date();
    logger.info("Running hourly cron job! 🚀");

    await hourlySheetsJob();
    await hourlyHotScoreJob();

    const endDate = new Date();
    logger.info("Hourly cron job completed! 🎉");
    const completedIn = endDate.getTime() - startDate.getTime();
    logger.info(`Completed in ${completedIn}ms`);
  });
}

export async function hourlySheetsJob() {
  try {
    // Setup connection to google spreadsheet
    const creds = {
      client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL ?? "",
      private_key:
        process.env.GOOGLE_SHEET_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "",
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
    let promises = [];
    for (const row of verifiedRows) {
      // Skip if the row is empty
      if (row._rawData.length === 0) continue;

      // Create a post from the row
      const postTime = new Date(row.Timestamp as string);
      const content = row.Post;
      const post = new Post({
        content,
        postTime,
        verifiedBrown: true,
      });
      promises.push(post.save());
    }
    await Promise.all(promises);

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
    promises = [];
    for (const row of unverifiedRows) {
      // Skip if the row is empty
      if (row._rawData.length === 0) continue;

      // Create a post from the row
      const postTime = new Date(row.Timestamp as string);
      const content = row.Post;
      const post = new Post({
        content,
        postTime,
        verifiedBrown: false,
      });
      promises.push(post.save());
    }
    await Promise.all(promises);

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

export async function hourlyHotScoreJob() {
  try {
    await Post.updateMany(
      { approvedTime: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      { $inc: { hotScore: -2 } }
    );
  } catch (err) {
    logger.error(err);
  }
}
