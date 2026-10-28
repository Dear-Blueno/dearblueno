[![Repo License](https://img.shields.io/badge/license-AGPL--3.0-orange?style=plastic)](./LICENSE)
[![Website](https://img.shields.io/website?style=plastic&url=https%3A%2F%2Fdearblueno.net%2F)](https://dearblueno.net/)

# Dear Blueno

This is the repository for the website for Dear Blueno, the unofficial anonymous post board for students and community members at Brown University in Providence.

This open-source project is built on the MERN stack ([MongoDB](https://www.mongodb.com/), [Express.js](https://expressjs.com/), [React.js](https://reactjs.org/), [Node.js](https://nodejs.org/)). We also use [TypeScript](https://www.typescriptlang.org/), [Next.js](https://nextjs.org/), [Mongoose.js](https://mongoosejs.com/), [Passport.js](https://www.passportjs.org/), [google-spreadsheet](https://theoephraim.github.io/node-google-spreadsheet/).

## License and Contributing

This project is licensed under GNU AGPLv3. [Read about it here.](https://choosealicense.com/licenses/agpl-3.0/) In short, you are free to modify and distribute the repository, under the condition that you provide attribution and disclose your modified source under the same license. We ask that you link back to this original repository if you choose to do this.

We invite you to contribute to the project! Fork this repository, commit your changes, then submit a pull request for your contributions to be reviewed. Alternatively, you may submit an issue to report a bug or suggestion.

## Deployment and migration

Use Node.js 24. The backend exports Express for Vercel Functions; Next.js stays on Vercel and MongoDB moves to Atlas Free. Background work runs once daily through authenticated Vercel Cron.

See [the migration runbook](docs/MIGRATION.md) for provisioning, environment setup, encrypted backups, staging, cutover, and rollback. Production deployment is disabled until the `VERCEL_DEPLOYMENTS_ENABLED` repository variable is explicitly enabled after migration checks. Once enabled, passing changes on `main` deploy to production and `staging` deploys to preview.
