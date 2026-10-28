#!/usr/bin/env node
// Idempotent provisioning through the authenticated CLIs; only Atlas M0 is allowed.
import { spawnSync } from "node:child_process";
const required = (key) => {
  if (!process.env[key]) throw new Error(`${key} is required`);
  return process.env[key];
};
function run(command, args, input) {
  const result = spawnSync(command, args, { input, encoding: "utf8" });
  if (result.error || result.status !== 0)
    throw new Error(`${command} failed; verify CLI authentication and access`);
  return result.stdout;
}
function vercel(path, method = "GET", body) {
  return JSON.parse(
    run(
      "vercel",
      ["api", path, "-X", method, "--raw", ...(body ? ["--input", "-"] : [])],
      body ? JSON.stringify(body) : undefined
    )
  );
}
function atlas(args) {
  return JSON.parse(run("atlas", [...args, "--output", "json"]));
}
function main() {
  if (process.env.PREFLIGHT_PASSED !== "true")
    throw new Error("Run production preflight and set PREFLIGHT_PASSED=true");
  const projects = [
    [required("ATLAS_DEVELOPMENT_PROJECT_ID"), "dearblueno-development"],
    [required("ATLAS_PRODUCTION_PROJECT_ID"), "dearblueno-production"],
  ];
  for (const [project, name] of projects) {
    const list = atlas(["clusters", "list", "--projectId", project]);
    const clusters = Array.isArray(list) ? list : list.results;
    if (!clusters.some((cluster) => cluster.name === name)) {
      atlas([
        "clusters",
        "create",
        name,
        "--projectId",
        project,
        "--provider",
        "AWS",
        "--region",
        "US_EAST_1",
        "--tier",
        "M0",
      ]);
    }
    const details = atlas([
      "clusters",
      "describe",
      name,
      "--projectId",
      project,
    ]);
    const tier =
      details.providerSettings?.instanceSizeName ??
      details.replicationSpecs?.[0]?.regionConfigs?.[0]?.electableSpecs
        ?.instanceSize;
    if (tier !== "M0")
      throw new Error(`${name} is not Free; refusing further changes`);
    console.info(`${name}: Free cluster, ${details.stateName}`);
  }
  const frontend = required("VERCEL_CLIENT_PROJECT_ID");
  const list = vercel("/v9/projects");
  let backend = list.projects.find(
    (project) => project.name === "dearblueno-api"
  );
  if (!backend)
    backend = vercel("/v11/projects", "POST", {
      name: "dearblueno-api",
      framework: "express",
    });
  for (const id of [backend.id, frontend])
    vercel(`/v9/projects/${id}`, "PATCH", {
      nodeVersion: "24.x",
      rootDirectory: null,
    });
  console.info(
    JSON.stringify({
      backendProjectId: backend.id,
      frontendProjectId: frontend,
    })
  );
}
try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
