import { mkdtemp, writeFile, readFile, rm } from "fs/promises";
import { tmpdir } from "os";
import { spawnSync } from "child_process";
import path from "path";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import setupForTests from "../testUtil";

describe("Migration verification", () => {
  let mongo: MongoMemoryServer;
  beforeAll(async () => {
    mongo = (await setupForTests()).db;
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });
  it("checks real database content/indexes and rejects a divergent target", async () => {
    const client = mongoose.connection.getClient();
    const source = client.db("migration_source"),
      target = client.db("migration_target");
    await source
      .collection("posts")
      .insertOne({ content: "post", approved: true });
    const docs = await source.collection("posts").find().toArray();
    await target.collection("posts").insertMany(docs);
    const run = (command: string) =>
      spawnSync(
        process.execPath,
        [path.resolve("scripts/migration.mjs"), command],
        {
          encoding: "utf8",
          env: {
            ...process.env,
            SOURCE_MONGODB_URI: mongo.getUri("migration_source"),
            TARGET_MONGODB_URI: mongo.getUri("migration_target"),
          },
        }
      );
    expect(run("preflight").status).toBe(0);
    expect(run("verify").status).toBe(0);
    await target
      .collection("posts")
      .updateOne({}, { $set: { content: "changed" } });
    const mismatch = run("verify");
    expect(mismatch.status).toBe(1);
    expect(mismatch.stderr).toContain("content hashes");
    await Promise.all([source.dropDatabase(), target.dropDatabase()]);
  });
  it("authenticates encrypted archives before invoking the restore tool", async () => {
    const directory = await mkdtemp(
      path.join(tmpdir(), "blueno-migration-test-")
    );
    try {
      await writeFile(
        path.join(directory, "mongodump"),
        "#!/usr/bin/env node\nprocess.stdout.write('fixture archive');\n",
        { mode: 0o700 }
      );
      await writeFile(
        path.join(directory, "mongorestore"),
        "#!/usr/bin/env node\nconst fs = require('fs'); const args = process.argv; const file = args.find((arg) => arg.startsWith('--archive=')).slice('--archive='.length); if (fs.readFileSync(file, 'utf8') !== 'fixture archive') process.exit(1);\n",
        { mode: 0o700 }
      );
      const archive = path.join(directory, "backup.enc");
      const env = {
        ...process.env,
        PATH: `${directory}${path.delimiter}${process.env.PATH ?? ""}`,
        BACKUP_PASSPHRASE: "test passphrase with enough entropy",
        SOURCE_DB_NAME: "migration_source",
        SOURCE_MONGODB_URI: mongo.getUri("migration_source"),
        TARGET_MONGODB_URI: mongo.getUri("migration_restore"),
      };
      const run = (command: string) =>
        spawnSync(
          process.execPath,
          [path.resolve("scripts/migration.mjs"), command, archive],
          { env, encoding: "utf8" }
        );
      expect(run("backup").status).toBe(0);
      expect(run("restore").status).toBe(0);
      const encrypted = await readFile(archive);
      encrypted[40] ^= 1;
      await writeFile(archive, encrypted);
      expect(run("restore").status).toBe(1);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
