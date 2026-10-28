# Vercel / Atlas migration runbook

## Status and prerequisites

Application configuration targets Node 24, Vercel Hobby (Express + existing Next.js frontend), and Atlas Free in AWS us-east-1. Jobs run daily at 09:00 UTC (start within the hour). No paid upgrade is permitted. The application API remains `https://api.dearblueno.net`; OAuth callback remains `/auth/google/callback`.

Install/authenticate `gh`, Vercel CLI 65.5.0, Atlas CLI, SSH, and MongoDB Database Tools. Supply server SSH connection details privately. `gh auth login`, `vercel login`, and `atlas auth login` may require browser consent. Account registration, unavailable credentials, and failed gates are the only intended human handoffs. Do not paste credentials into issues, logs, or commits.

The repository now disables automated deployment until `VERCEL_DEPLOYMENTS_ENABLED=true` is set as a GitHub repository variable. Old SFTP and mirror workflows have been replaced. Do not merge/push until the replacement is configured and validated. Work on a branch; main was previously live-deployed.

## 1. Measure before provisioning

Use SSH to inspect the current service manager and MongoDB version; discover actual paths/service names rather than guessing. Record the current server timezone, reverse proxy config, DNS provider/TTL, service restart command, and jobs. Inventory all writes including GET `/auth`, login, and logout. Save previous deploy and DNS settings.

Forward MongoDB over SSH rather than opening its port publicly. Put the source URI in `SOURCE_MONGODB_URI` (include the application DB name). Set restrictive file permissions on any local credential files. Run:

```sh
node server/scripts/migration.mjs preflight > /tmp/dearblueno-preflight.json
BASELINE_API_URL=https://api.dearblueno.net CANDIDATE_API_URL=https://api.dearblueno.net node scripts/benchmark.mjs
```

The sizing gate is application data + indexes below 409.6 MiB. Development/staging and production use separate M0 clusters in their existing Atlas projects; each cluster has its own 512 MiB allowance. Compare restored target size again. Review existing dangling references rather than silently repairing/deleting data. Collect traffic from the existing proxy and Vercel account usage; check projected CPU, memory, requests, MongoDB ops/transfer and storage against current free quotas. Benchmark read-only representative endpoints; use Vercel logs to confirm genuine cold invocations (the script's first request is only a proxy).

## 2. Provision free services and secrets

Set `ATLAS_DEVELOPMENT_PROJECT_ID`, `ATLAS_PRODUCTION_PROJECT_ID`, `VERCEL_CLIENT_PROJECT_ID`, and `PREFLIGHT_PASSED=true`; run `node scripts/provision.mjs`. It uses the authenticated Atlas/Vercel CLIs, explicitly creates M0 clusters if missing, verifies their tiers, creates/reuses `dearblueno-api`, and uses Node 24. It never selects Atlas's paid default tier. CLI deployments upload the `server` and `client` directories individually, so Vercel project root directories must be empty/null. Keep Git auto-deploy disconnected to avoid bypassing CI.

Use authenticated Atlas CLI/Admin API to create separate `readWrite` users scoped to `dearbluenoprod` and `dearbluenostaging`. Do not give the application Atlas admin or any-database privileges. Keep import/index credentials separate where permissions require it. Add `0.0.0.0/0` to the Atlas IP access list because Hobby uses dynamic outbound IPs; require TLS and long random passwords. Atlas is authenticated and publicly reachable, not a private network. Paid native backup subscriptions stay off.

Populate Vercel **production** and **preview** variables separately from `server/.env.example`. The automation helper `node --env-file=/secure/environment.env scripts/configure-env.mjs production` (or `preview`) uploads backend/frontend values to the selected projects and, for production, the GitHub secrets. Supply the named app variables plus Vercel project/account IDs in that private file. It always leaves jobs disabled. Local setup uses the authenticated Vercel CLI; `VERCEL_TOKEN` is needed only for unattended CI. Use distinct private input files for production and preview. Use Vercel CLI `env add NAME production` / `env add NAME preview` with secrets on stdin. Preserve the existing production `SESSION_SECRET`; set a distinct staging secret and a random `CRON_SECRET` of at least 32 characters. Initially set `JOBS_ENABLED=false` in both environments. Set `MONGODB_URI`, Google OAuth credentials/callback, and Google Sheets service-account keys. Production requires HTTPS URLs. Only set `JOBS_ENABLED=true` when all four Sheets variables are ready.

Preview must use its own DB user, URI, Sheets, and OAuth client/callback. Never send previews to the production Sheets or production database. Use `stagingapi.dearblueno.net` and the existing staging frontend domain; register the exact staging OAuth callback in Google if absent. Keep the original Brown-domain eligibility behavior. Set frontend `NEXT_PUBLIC_API_URL` and Imgur client ID per environment.

Configure GitHub secrets through `gh secret set` from stdin: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_API_PROJECT_ID`, `VERCEL_CLIENT_PROJECT_ID`, and `CRON_SECRET`. Check the selected Vercel account remains Hobby; do not start a trial or attach paid add-ons.

## 3. Rehearse and validate

Set `BACKUP_PASSPHRASE` (20+ characters), `SOURCE_MONGODB_URI`, `TARGET_MONGODB_URI` and `SOURCE_DB_NAME`. Keep backup files outside the repo. Backup encryption is AES-256-GCM with a scrypt-derived key and a random salt/IV. MongoDB credentials go into temporary mode-0600 config files, not tool command arguments. Backup files are mode 0600. The passphrase must be retained separately from the encrypted dump.

```sh
node server/scripts/migration.mjs backup /tmp/dearblueno-rehearsal.enc
node server/scripts/migration.mjs restore /tmp/dearblueno-rehearsal.enc
node server/scripts/migration.mjs verify
```

Restore refuses a nonempty destination; it never drops a database. For a live rehearsal, hashes can differ because the source is still writing: final verification requires a frozen source. Sessions can expire via TTL, so record/explain any TTL-only difference and rerun a controlled frozen verification; never ignore application-data differences.

After content/index verification, create additive application indexes on the target:

```sh
cd server
MONGODB_URI="$TARGET_MONGODB_URI" npm run db:indexes
```

Before the first daily batch, seed the legacy streak checkpoint from the last **successful** source cron completion log. Both source PM2 logs show completion at midnight Eastern on October 28, processing the completed date October 27. Recheck this immediately before final cutover if the date has changed. Run `LEGACY_LAST_COMPLETED_STREAK_DAY=2026-10-27 MONGODB_URI="$TARGET_MONGODB_URI" npm run db:initialize-daily` after raw restore verification. This adds only a missing checkpoint; it never awards XP or changes streak counts. Without this step the first serverless batch could award the same day twice.

Do not use `syncIndexes` to remove restored indexes. The unique sparse post `importId` index must exist before imports run. Re-run content verification before index creation when comparing exact index lists.

Run backend lint/build/integration tests and frontend lint/build. Integration tests use disposable MongoDB 7 via mongodb-memory-server; a supported newer MongoDB is fine. Live Sheets E2E tests are opt-in, destructive to their test sheet, and require `TESTING_GOOGLE_SHEET_ID` that is different from both production sheets. They must never run automatically against real submission sheets.

Deploy staging with `DEPLOY_TARGET=preview bash scripts/deploy.sh`. Exercise login/logout, persistent sessions, search, feeds, post/comment/reaction/moderation, bookmarks, events/reminders, public profile ISR, sitemap, dialogs, mobile layout, image optimization, and the offline page. Use a controlled isolated environment to test the daily batch; production previews remain jobs-disabled. A manual authorized run uses `GET /internal/jobs/daily` with `Authorization: Bearer <CRON_SECRET>`. Never put that token into a URL. Inspect `/internal/jobs/status` with the same header.

Run the benchmark with baseline and candidate URLs. Protected Vercel candidates can use `CANDIDATE_PROTECTION_BYPASS`; keep that value out of logs. Only public read endpoints are benchmarked; `/events` requires authentication and should return 401 without it. Require warm p95 no worse than max(baseline × 1.25, baseline + 100ms), cold requests below 2s, and daily batch below 4 minutes. If any gate fails, stop; no automatic paid fallback.

## 4. Production cutover (30-minute maintenance window)

1. Lower DNS TTL in advance. Set up maintenance at the OLD reverse proxy to block **all API traffic**, including GETs that write. Keep an administrative SSH path. Stop old node-cron processes/service and verify no other importers are running.
2. Make an encrypted final backup. Restore into an empty production target, run exact verification, then additive index creation. If the window/gates fail, abandon the target and reopen the old source; do not delete the original.
3. Start the prepared compatibility copies under the unprivileged `nick` account on the old API ports, using Node 24, Atlas, and `JOBS_ENABLED=false`. Keep the original `nodejs` PM2 apps stopped; preserve cookie secrets and the session collection. These compatibility copies must pass smoke checks before DNS switches. This avoids granting permission to edit nodejs-owned configuration or nginx.
4. Deploy both Vercel projects using the tested workflow. Confirm backend production points at Atlas, frontend at `api.dearblueno.net`, and sessions/OAuth work with the preserved hostname. Keep jobs off until old scheduler shutdown is verified.
5. Add the API domain to the backend Vercel project with the CLI. Verify domain ownership and change only the needed DNS record using the actual DNS provider's CLI/API. If Cloudflare manages DNS, use **cf CLI** (there is no Wrangler config); discover commands with `cf cli search` and preview first. Never move nameservers as part of this migration.
6. Verify TLS, login, reads and writes on Vercel; reopen maintenance. Enable `JOBS_ENABLED=true` in production, redeploy, run the daily batch once, and inspect status. The batch skips already-completed stages on same-day resumption. Reminders cover future approved events within 25h. Sheets get `ImportId` and `ImportedAt` columns; do not reorder or clear these columns. Existing pending form submissions remain intact.
7. Set GitHub variables `VERCEL_DEPLOYMENTS_ENABLED=true` and `VERCEL_JOBS_ENABLED=true`. Ensure Actions failure notifications are configured for the owner. The watchdog checks at 12:00 UTC and fails on HTTP errors or success older than 36h; it does not auto-retry mutations.

## 5. Observe, back up, roll back, and retire

Record cutover time and baseline counts. Observe seven days of logs, latency, daily job completion, quota and storage. The daily batch persists per-day stage completion, an exclusive six-minute lease (longer than the five-minute function limit), per-user streak dates and reminder deduplication. Failures propagate. Retry `/internal/jobs/daily` after fixing the cause. A timeout can require waiting for the lease to expire. A completely missed reminder window cannot send an event reminder retroactively.

For application rollback, disable Vercel jobs and switch the API hostname back to the compatible DigitalOcean service **using Atlas**, with jobs still off. Then enable exactly one scheduler. Never point users at the stale local database after writes have begun in Atlas. If frontend promotion fails after backend promotion, retain both deployment URLs, repair/promote the frontend or roll back backend code against Atlas; cross-project promotion is not atomic. Never restart the original nodejs-owned applications after Atlas receives writes; they still target the old database. Hosting rollback uses only the new nick-owned compatibility copies configured for Atlas.

Take encrypted backups with the same CLI before migration, before retirement, and before subsequent risky operations. Store a verified copy outside DigitalOcean and keep its encryption passphrase separately. This free baseline does not include managed recurring disaster-recovery backups; do not imply Atlas replication is a backup. Restore into a new empty DB for drills and compare fingerprints.

**This droplet also hosts Predictions Contest and Brown Climbing. Do not delete it.** After seven healthy days and a final verified backup, retire only the two Dear Blueno applications, their compatibility copies and migration-specific startup entries. Leave shared MongoDB/nginx and the other apps intact. Remove old SSH/PAT deploy secrets and service credentials. Retain encrypted data backups under the owner's retention policy. If there is no ongoing agent/automation session, leave retirement pending and report it rather than deleting early.
