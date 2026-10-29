export default function validateEnvironment() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  if (process.env.NODE_ENV !== "production") return;
  const keys = [
    "SESSION_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "CLIENT_URL",
    "CRON_SECRET",
  ];
  if (process.env.JOBS_ENABLED === "true")
    keys.push(
      "VERIFIED_GOOGLE_SHEET_ID",
      "UNVERIFIED_GOOGLE_SHEET_ID",
      "GOOGLE_SHEET_CLIENT_EMAIL",
      "GOOGLE_SHEET_PRIVATE_KEY"
    );
  for (const key of keys) {
    if (!process.env[key]) throw new Error(`${key} is required in production`);
  }
  for (const key of ["CLIENT_URL", "GOOGLE_CALLBACK_URL"]) {
    if (new URL(process.env[key] ?? "").protocol !== "https:")
      throw new Error(`${key} must use HTTPS`);
  }
  if (
    (process.env.SESSION_SECRET?.length ?? 0) < 32 ||
    (process.env.CRON_SECRET?.length ?? 0) < 32
  ) {
    throw new Error(
      "Production session and cron secrets must be at least 32 characters"
    );
  }
}
