const { API_URL, CRON_SECRET } = process.env;
if (!API_URL || !CRON_SECRET)
  throw new Error("API_URL and CRON_SECRET are required");
const response = await fetch(new URL("/internal/jobs/status", API_URL), {
  headers: { authorization: `Bearer ${CRON_SECRET}` },
  signal: AbortSignal.timeout(30000),
});
if (!response.ok)
  throw new Error(`Daily job unhealthy: HTTP ${response.status}`);
const result = await response.json();
if (
  !result.healthy ||
  Date.now() - Date.parse(result.lastSuccess) >= 36 * 3600000
) {
  throw new Error("Daily job has not succeeded in the last 36 hours");
}
console.info("Daily job healthy");
