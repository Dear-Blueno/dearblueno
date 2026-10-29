#!/usr/bin/env node
// Example: node --env-file=/secure/production.env scripts/configure-env.mjs production
// The input file is local and must never be committed. No values are printed.
import { spawnSync } from "node:child_process";
const [target] = process.argv.slice(2);
if (!["production", "preview"].includes(target))
  throw new Error("Choose production or preview");
const required = (key) => {
  if (!process.env[key]) throw new Error(`${key} is required`);
  return process.env[key];
};

const apiProject = required("VERCEL_API_PROJECT_ID"),
  clientProject = required("VERCEL_CLIENT_PROJECT_ID");
const team = process.env.VERCEL_TEAM_ID;
const keys = [
  "MONGODB_URI",
  "CLIENT_URL",
  "GOOGLE_CALLBACK_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "SESSION_SECRET",
  "CRON_SECRET",
];
const apiVariables = Object.fromEntries(
  keys.map((key) => [key, required(key)])
);
for (const key of [
  "VERIFIED_GOOGLE_SHEET_ID",
  "UNVERIFIED_GOOGLE_SHEET_ID",
  "GOOGLE_SHEET_CLIENT_EMAIL",
  "GOOGLE_SHEET_PRIVATE_KEY",
]) {
  if (process.env[key]) apiVariables[key] = process.env[key];
}
if (
  new URL(apiVariables.CLIENT_URL).protocol !== "https:" ||
  new URL(apiVariables.GOOGLE_CALLBACK_URL).protocol !== "https:"
) {
  throw new Error("Deployed client and callback URLs must be HTTPS");
}
if (
  apiVariables.SESSION_SECRET.length < 32 ||
  apiVariables.CRON_SECRET.length < 32
)
  throw new Error("Secrets must contain at least 32 characters");
apiVariables.JOBS_ENABLED = "false";
apiVariables.MAINTENANCE_MODE = "false";
const clientVariables = {
  NEXT_PUBLIC_API_URL: required("NEXT_PUBLIC_API_URL"),
  NEXT_PUBLIC_IMGUR_CLIENT_ID: required("NEXT_PUBLIC_IMGUR_CLIENT_ID"),
};
async function upload(project, variables) {
  const url = new URL(
    `https://api.vercel.com/v10/projects/${encodeURIComponent(project)}/env`
  );
  url.searchParams.set("upsert", "true");
  if (team) url.searchParams.set("teamId", team);
  for (const [key, value] of Object.entries(variables)) {
    const input = JSON.stringify({
      key,
      value,
      type: "encrypted",
      target: [target],
    });
    const result = spawnSync(
      "vercel",
      ["api", url.pathname + url.search, "-X", "POST", "--input", "-", "--raw"],
      { input, encoding: "utf8" }
    );
    if (result.error || result.status !== 0)
      throw new Error(`Environment configuration failed for ${key}`);
    const response = JSON.parse(result.stdout);
    if (response.error || response.errors?.length || response.failed?.length)
      throw new Error(`Vercel rejected ${key}`);
  }
}
await upload(apiProject, apiVariables);
await upload(clientProject, clientVariables);
if (target === "production") {
  const repo = process.env.GITHUB_REPOSITORY ?? "Dear-Blueno/dearblueno";
  for (const key of [
    "VERCEL_TOKEN",
    "VERCEL_ORG_ID",
    "VERCEL_API_PROJECT_ID",
    "VERCEL_CLIENT_PROJECT_ID",
    "CRON_SECRET",
  ]) {
    if (key === "VERCEL_TOKEN" && !process.env.VERCEL_TOKEN) continue;
    const result = spawnSync("gh", ["secret", "set", key, "--repo", repo], {
      input: required(key),
      stdio: ["pipe", "pipe", "pipe"],
    });
    if (result.error || result.status !== 0)
      throw new Error(
        `GitHub secret configuration failed for ${key}; authenticate gh and rerun`
      );
  }
}
console.info(
  `${target} environments configured. Daily jobs remain disabled until cutover checks pass.`
);
