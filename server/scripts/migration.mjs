#!/usr/bin/env node
// All connection strings come from the environment; never print credentials.
import { MongoClient, BSON } from "mongodb";
import {
  createHash,
  randomBytes,
  scryptSync,
  createCipheriv,
  createDecipheriv,
} from "node:crypto";
import { mkdtemp, writeFile, readFile, rm, open } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { pipeline } from "node:stream/promises";

export const LIMIT = 0.8 * 512 * 1024 * 1024;
function required(name) {
  if (!process.env[name]) throw new Error(`${name} is required`);
  return process.env[name];
}
async function connect(name) {
  const uri = required(name);
  const dbName = new URL(uri).pathname.slice(1);
  if (!dbName || ["admin", "local", "config"].includes(dbName))
    throw new Error(`${name} must name an application database`);
  const client = new MongoClient(uri, {
    maxPoolSize: 2,
    serverSelectionTimeoutMS: 10000,
  });
  await client.connect();
  return { client, db: client.db(dbName), dbName, uri };
}
async function fingerprint(db) {
  const result = {};
  for (const { name } of await db
    .listCollections({}, { nameOnly: true })
    .toArray()) {
    if (name.startsWith("system.")) continue;
    const hash = createHash("sha256");
    let count = 0;
    for await (const doc of db.collection(name).find().sort({ _id: 1 })) {
      hash.update(BSON.EJSON.stringify(doc, { relaxed: false }));
      count++;
    }
    const indexes = (await db.collection(name).indexes())
      .map(({ v: _v, ns: _ns, ...index }) => index)
      .sort((a, b) => a.name.localeCompare(b.name));
    result[name] = { count, sha256: hash.digest("hex"), indexes };
  }
  return result;
}
async function references(db) {
  const checks = [
    ["posts", "comments", "comments"],
    ["posts", "subscribers", "users"],
    ["comments", "post", "posts"],
    ["comments", "author", "users"],
    ["comments", "parentComment", "comments"],
    ["users", "bookmarks", "posts"],
    ["users", "subscriptions", "posts"],
    ["events", "going", "users"],
    ["events", "interested", "users"],
  ];
  let dangling = 0;
  for (const [collection, field, target] of checks) {
    const [result] = await db
      .collection(collection)
      .aggregate([
        { $project: { ref: `$${field}` } },
        { $unwind: "$ref" },
        { $match: { ref: { $ne: null } } },
        {
          $lookup: {
            from: target,
            localField: "ref",
            foreignField: "_id",
            as: "target",
          },
        },
        { $match: { target: { $size: 0 } } },
        { $count: "count" },
      ])
      .toArray();
    dangling += result?.count ?? 0;
  }
  return dangling;
}
function tool(command, args) {
  const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
  // Tool stderr can include connection details; suppress it and report exit status only.
  child.stderr.resume();
  const completion = new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} failed (${code})`))
    );
  });
  return { child, completion };
}
async function backup(source, file) {
  const passphrase = required("BACKUP_PASSPHRASE");
  if (passphrase.length < 20)
    throw new Error("Use a backup passphrase of at least 20 characters");
  const directory = await mkdtemp(join(tmpdir(), "blueno-backup-"));
  try {
    const config = join(directory, "mongo.yml");
    await writeFile(config, `uri: ${JSON.stringify(source.uri)}\n`, {
      mode: 0o600,
    });
    const salt = randomBytes(16),
      iv = randomBytes(12);
    const cipher = createCipheriv(
      "aes-256-gcm",
      scryptSync(passphrase, salt, 32),
      iv
    );
    const output = createWriteStream(file, { flags: "wx", mode: 0o600 });
    output.write(Buffer.concat([Buffer.from("BLUENO01"), salt, iv]));
    const { child, completion } = tool("mongodump", [
      "--config",
      config,
      "--db",
      source.dbName,
      "--archive",
      "--gzip",
    ]);
    try {
      await Promise.all([pipeline(child.stdout, cipher, output), completion]);
      const handle = await open(file, "a");
      try {
        await handle.write(cipher.getAuthTag());
      } finally {
        await handle.close();
      }
    } catch (error) {
      child.kill();
      await rm(file, { force: true });
      throw error;
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
async function restore(target, file) {
  if (
    (await target.db.listCollections({}, { nameOnly: true }).toArray()).length
  ) {
    throw new Error(
      "Restore target must be an empty, dedicated database; this command never drops data"
    );
  }
  const encrypted = await readFile(file);
  if (encrypted.subarray(0, 8).toString() !== "BLUENO01")
    throw new Error("Unknown backup format");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    scryptSync(required("BACKUP_PASSPHRASE"), encrypted.subarray(8, 24), 32),
    encrypted.subarray(24, 36)
  );
  decipher.setAuthTag(encrypted.subarray(-16));
  // Authenticate fully BEFORE handing any data to mongorestore.
  const archive = Buffer.concat([
    decipher.update(encrypted.subarray(36, -16)),
    decipher.final(),
  ]);
  const directory = await mkdtemp(join(tmpdir(), "blueno-restore-"));
  try {
    const config = join(directory, "mongo.yml"),
      archivePath = join(directory, "archive.gz");
    await writeFile(config, `uri: ${JSON.stringify(target.uri)}\n`, {
      mode: 0o600,
    });
    await writeFile(archivePath, archive, { mode: 0o600 });
    const sourceName = required("SOURCE_DB_NAME");
    if (!/^[\w-]+$/.test(sourceName) || !/^[\w-]+$/.test(target.dbName))
      throw new Error("Unsupported database name");
    const { child, completion } = tool("mongorestore", [
      "--config",
      config,
      `--archive=${archivePath}`,
      "--gzip",
      "--nsInclude",
      `${sourceName}.*`,
      "--nsFrom",
      `${sourceName}.*`,
      "--nsTo",
      `${target.dbName}.*`,
      "--stopOnError",
    ]);
    child.stdout.resume();
    await completion;
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
async function main() {
  const [command, filename] = process.argv.slice(2);
  const connections = [];
  const get = async (key) => {
    const connection = await connect(key);
    connections.push(connection);
    return connection;
  };
  try {
    if (command === "preflight") {
      const { db } = await get("SOURCE_MONGODB_URI");
      const stats = await db.stats({ scale: 1 });
      const { version } = await db.command({ buildInfo: 1 });
      const logicalBytes = stats.dataSize + stats.indexSize;
      const collections = await fingerprint(db);
      const danglingReferences = await references(db);
      const report = {
        version,
        logicalBytes,
        limitBytes: LIMIT,
        fitsFreeTier: logicalBytes < LIMIT,
        danglingReferences,
        collections,
      };
      console.info(JSON.stringify(report, null, 2));
      if (!report.fitsFreeTier)
        throw new Error("Database exceeds the free-tier headroom gate");
    } else if (command === "backup") {
      if (!filename) throw new Error("Provide an encrypted backup filename");
      await backup(await get("SOURCE_MONGODB_URI"), resolve(filename));
      console.info("Encrypted backup completed");
    } else if (command === "restore") {
      if (!filename) throw new Error("Provide an encrypted backup filename");
      await restore(await get("TARGET_MONGODB_URI"), resolve(filename));
      console.info("Restore completed; run verify before enabling traffic");
    } else if (command === "verify") {
      const source = await get("SOURCE_MONGODB_URI"),
        target = await get("TARGET_MONGODB_URI");
      const [before, after] = await Promise.all([
        fingerprint(source.db),
        fingerprint(target.db),
      ]);
      const canonical = (value) =>
        JSON.stringify(Object.fromEntries(Object.entries(value).sort()));
      if (canonical(before) !== canonical(after))
        throw new Error("Collection counts, content hashes, or indexes differ");
      const sourceDangling = await references(source.db),
        targetDangling = await references(target.db);
      if (targetDangling !== sourceDangling)
        throw new Error("Reference integrity differs");
      const stats = await target.db.stats({ scale: 1 });
      if (stats.dataSize + stats.indexSize >= LIMIT)
        throw new Error("Restored target exceeds free-tier headroom");
      console.info(
        JSON.stringify({ verified: true, danglingReferences: targetDangling })
      );
    } else
      throw new Error(
        "Usage: migration.mjs preflight | backup FILE | restore FILE | verify"
      );
  } finally {
    await Promise.all(connections.map(({ client }) => client.close()));
  }
}
main().catch((error) => {
  // Driver errors may include credentials or hostnames. Print only controlled messages.
  const safe =
    /^(Use |Provide |Restore target|Unknown backup|Unsupported database|Database exceeds|Collection counts|Reference integrity|Restored target|Usage:|[A-Z_]+ (is required|must name)|mongo(dump|restore) failed)/;
  console.error(
    safe.test(error.message)
      ? error.message
      : "Migration operation failed; check credentials, connectivity, and tool compatibility"
  );
  process.exitCode = 1;
});
