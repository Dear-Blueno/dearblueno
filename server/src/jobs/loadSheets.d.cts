declare function loadSheets(): Promise<typeof import("google-spreadsheet")>;
export = loadSheets;
