import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function parseDeploymentResult(input) {
  const result = JSON.parse(input);
  const deployment = result?.deployment ?? result;
  // Agent/non-interactive CLI mode wraps the result; ordinary CI returns it flat.
  if (
    result?.error ||
    deployment?.error ||
    (result?.status !== undefined && result.status !== "ok")
  ) {
    throw new Error("Vercel reported an unsuccessful deployment");
  }
  if (deployment?.readyState !== "READY") {
    throw new Error(
      `Deployment is not ready (${deployment?.readyState ?? "missing state"})`
    );
  }
  if (!/^dpl_[a-zA-Z0-9]+$/.test(deployment.id ?? "")) {
    throw new Error("Deployment ID is missing or invalid");
  }
  if (typeof deployment.url !== "string" || !deployment.url) {
    throw new Error("Deployment URL is missing");
  }
  const url = new URL(
    deployment.url.includes("://")
      ? deployment.url
      : `https://${deployment.url}`
  );
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    /\s/.test(deployment.url)
  ) {
    throw new Error(
      "Deployment URL must be HTTPS without credentials or whitespace"
    );
  }
  return { id: deployment.id, url: url.origin };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    let input = "";
    for await (const chunk of process.stdin) input += chunk;
    const deployment = parseDeploymentResult(input);
    console.log(`${deployment.id}\t${deployment.url}`);
  } catch (error) {
    console.error(`Invalid Vercel deployment result: ${error.message}`);
    process.exitCode = 1;
  }
}
