/* eslint-disable no-await-in-loop -- Persist row identity before importing and marking completion. */
import { randomUUID } from "crypto";
import type {
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import loadSheets from "./loadSheets.cjs";
import { JWT } from "google-auth-library";
import Post from "../models/Post";
import type { Checkpoint } from "./maintenance";

export interface ImportRow {
  timestamp: string;
  content: string;
  importId?: string;
  processed?: string;
  save: (id: string, processed?: string) => Promise<void>;
}

export async function importRows(
  sheetId: string,
  verifiedBrown: boolean,
  rows: ImportRow[],
  checkpoint: Checkpoint
) {
  for (const row of rows) {
    await checkpoint();
    if (!row.content || row.processed) continue;
    const postTime = new Date(row.timestamp);
    if (Number.isNaN(postTime.getTime()))
      throw new Error("Invalid Sheet timestamp");
    const id = row.importId ?? randomUUID();
    // Persist identity BEFORE inserting. A retry after either write uses the same ID.
    if (!row.importId) await row.save(id);
    await Post.updateOne(
      { importId: `${sheetId}:${id}` },
      {
        $setOnInsert: {
          importId: `${sheetId}:${id}`,
          content: row.content,
          postTime,
          verifiedBrown,
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
    await row.save(id, new Date().toISOString());
  }
}

type HeaderSheet = Pick<
  GoogleSpreadsheetWorksheet,
  | "loadHeaderRow"
  | "setHeaderRow"
  | "resize"
  | "headerValues"
  | "columnCount"
  | "rowCount"
>;
export async function ensureSheetHeaders(sheet: HeaderSheet) {
  try {
    await sheet.loadHeaderRow();
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.startsWith("No values in the header row")
    )
      throw error;
    // An entirely blank first row is safe to initialize; never clear submission rows.
    if (sheet.columnCount < 2)
      await sheet.resize({ rowCount: sheet.rowCount, columnCount: 2 });
    await sheet.setHeaderRow(["Timestamp", "Post"]);
  }
  if (
    !sheet.headerValues.includes("Timestamp") ||
    !sheet.headerValues.includes("Post")
  ) {
    throw new Error("Submission Sheet requires Timestamp and Post headers");
  }
  const headers = [...sheet.headerValues];
  for (const header of ["ImportId", "ImportedAt"])
    if (!headers.includes(header)) headers.push(header);
  if (headers.length !== sheet.headerValues.length) {
    if (sheet.columnCount < headers.length)
      await sheet.resize({
        rowCount: sheet.rowCount,
        columnCount: headers.length,
      });
    await sheet.setHeaderRow(headers);
  }
}

export async function importSheets(
  checkpoint: Checkpoint = () => Promise.resolve()
) {
  const { GoogleSpreadsheet } = await loadSheets();
  for (const [sheetId, verifiedBrown] of [
    [process.env.VERIFIED_GOOGLE_SHEET_ID, true],
    [process.env.UNVERIFIED_GOOGLE_SHEET_ID, false],
  ] as const) {
    await checkpoint();
    if (!sheetId) throw new Error("Both Google Sheet IDs are required");
    const auth = new JWT({
      email: process.env.GOOGLE_SHEET_CLIENT_EMAIL ?? "",
      key: process.env.GOOGLE_SHEET_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await ensureSheetHeaders(sheet);
    // Google Forms append rows; never delete rows or clear the sheet during import.
    const rows: GoogleSpreadsheetRow[] = await sheet.getRows();
    await importRows(
      sheetId,
      verifiedBrown,
      rows.map((row) => ({
        timestamp: String(row.get("Timestamp") ?? ""),
        content: String(row.get("Post") ?? ""),
        importId: row.get("ImportId") as string | undefined,
        processed: row.get("ImportedAt") as string | undefined,
        save: async (id, processed) => {
          row.set("ImportId", id);
          if (processed) row.set("ImportedAt", processed);
          await row.save();
        },
      })),
      checkpoint
    );
  }
}

// Read-only deployment check: validates ESM loading, credentials, and Sheet access.
export async function verifySheets() {
  const { GoogleSpreadsheet } = await loadSheets();
  const auth = new JWT({
    email: process.env.GOOGLE_SHEET_CLIENT_EMAIL ?? "",
    key: process.env.GOOGLE_SHEET_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  await Promise.all(
    [
      process.env.VERIFIED_GOOGLE_SHEET_ID,
      process.env.UNVERIFIED_GOOGLE_SHEET_ID,
    ].map(async (id) => {
      if (!id) throw new Error("Both Google Sheet IDs are required");
      await new GoogleSpreadsheet(id, auth).loadInfo();
    })
  );
}
