# Migration status — October 28, 2026

## Verified setup

- Vercel CLI 65.5.0 is authenticated as `dear-blueno` on the existing Hobby team. The official Vercel plugin is installed in Codex user scope; the shared `https://mcp.vercel.com` connection is configured and OAuth-authorized. Its tools require a client refresh/reload before this running chat can invoke them; deployment work uses the authenticated CLI.
- New Atlas M0 clusters in AWS us-east-1: `dearblueno-development` in **Dear Blueno (Development)** and `dearblueno-production` in **Dear Blueno (Production)**. Backups/subscriptions remain disabled. Each app user has read/write access only to its application's database and cluster.
- Source MongoDB on DigitalOcean is version 6.0.13. Production contains 7,319 posts, 17,227 comments, 1,046 users, 14 events and 6 reports; logical data plus indexes is about 19.2 MB. Staging contains 5,433 posts, 12,889 comments and 910 users; logical size plus indexes is about 12.6 MB.
- Both encrypted rehearsal restores were verified against DigitalOcean by full document hashes, counts, indexes, and reference checks. Each source has one pre-existing dangling reference, preserved without alteration.
- Rehearsal backup files are in `/Users/nick/Documents/DearBlueno Migration/`. Their encryption key is stored in macOS Keychain under service **DearBlueno backup encryption**, account **dearblueno-migration**. Credentials and raw diagnostics are kept in a mode-0700 temporary migration directory and never committed.
- New backend Vercel project: `dearblueno-api` (`prj_GYgXmbBtsoJZua51NKb4WB518Tu5`). Existing frontend: `dearblueno` (`prj_mOGNBGb7PtKOYofMOjgxXODhOUza`). Both use Node 24; API uses iad1 with Fluid Compute.
- Production and preview variables are isolated. Existing OAuth callbacks, client origins and session secrets are preserved. Preview uses the old dedicated staging Sheets, which are distinct from production. Jobs remain disabled.
- The frontend's old mirror-repository integration was disconnected. New CLI deployments upload component folders directly; project root directories are empty. The old production frontend deployment continues serving its custom domains until promotion.
- The backend's feeds/search, unauthenticated auth response, event access restriction, and read-only Google Sheets readiness check pass in Vercel. A native dynamic-import adapter fixes a CommonJS/ESM incompatibility that appears under Vercel's runtime loader.
- API and staging API domains are registered on the backend project. TLS certificates were issued using Cloudflare DNS TXT challenges, without changing traffic records. The staging API alias points to the verified development-database preview; direct-origin TLS verification passes. Deployment automation uses Vercel's alias API because the alias CLI rejects the existing root-domain ownership arrangement.

## Performance and validation

- All four public-read performance gates passed against the production candidate. Warm p95: root 159 ms vs 154 ms baseline; new feed 120 ms vs 120 ms; hot feed 179 ms vs 122 ms; search 182 ms vs 139 ms. First-request measurements were below two seconds (these are a proxy, not proof of a forced cold start).
- The expanded regression suite passes 252 tests, including blank Sheet headers and legacy checkpoint initialization. Actual `mongorestore` optional-argument handling was corrected and the cryptographic/verification tests were rerun against the real CLI behavior.

## Daily batch rehearsal

- A temporary protected deployment ran the complete daily batch against the staging clone in **9.56 seconds**. A repeat call returned `already-completed` in 0.17 seconds, and the status endpoint was healthy.
- All 910 staging users retained their seeded legacy checkpoint. No submission posts were imported because the staging Sheets were empty; blank headers were safely initialized. The temporary jobs-enabled deployment was removed afterward; normal preview/production jobs remain disabled.
- PR #76 is ready for review. Backend/frontend CI passes; the workflow now also preserves the existing required `Build and Test` status. Main requires one approving review from someone other than the PR author.

## Pending cutover requirements

- The original five scoped PM2 rules are installed and verified. Use `sudo -n` exclusively. The two original Dear Blueno applications were stopped and PM2 state saved at approximately 8:57 p.m. Eastern on October 28; the disposable compatibility check process was also stopped.
- Final source preflight failed before any final backup or Atlas database replacement. The source `mongod.service` was found failed after signal KILL at 3:58 p.m. Eastern, several hours before the cutover attempt. Its data directory remains present. An additional single-command rule for `/usr/bin/systemctl start mongod` as root has been requested and added to the sudoers example. Recover the database, then rerun frozen-source backup/restore/verification. Never substitute rehearsal data for a final migration.
- GitHub project IDs, `CRON_SECRET`, and `VERCEL_TOKEN` are now configured. Token presence is verified; unattended deployment still needs validation after the PR is merged.
- Legacy daily completion was verified in both source PM2 logs at midnight Eastern on October 28. Seed `lastStreakDate=2026-10-27` after final raw verification (or recheck the date if cutover occurs later), avoiding duplicate streak/XP awards.
- Rollback runtime Node 24.22.1 and isolated PM2 are installed under `/home/nick/dearblueno-migration`; validation uses port 3101. The original ports and applications are not changed.
- Final cutover requires stopping the source writers, a fresh encrypted backup and final restore, verification, deployed application smoke checks, and the documented performance/job-duration gates. Rehearsal data is not a final production migration.
- Cloudflare API and staging API records are currently proxied A records pointing to DigitalOcean. Original records are saved privately for rollback; no DNS switch has occurred.

## Droplet retirement

The owner confirmed that `predictionsapi-prod` (Predictions Contest) and `brownclimbingapi-prod` (Brown Climbing) are discontinued and need no ongoing hosting. Full DigitalOcean droplet decommissioning is authorized after Dear Blueno's successful cutover, seven healthy observation days, and a verified final encrypted backup stored outside the droplet. Keep the droplet available for Atlas-backed application rollback until those gates pass. Retire obsolete deployment credentials and inspect droplet-associated billable resources before closing out the migration; remove only resources verified to belong exclusively to this droplet.
