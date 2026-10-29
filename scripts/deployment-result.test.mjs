import assert from "node:assert/strict";
import test from "node:test";
import { parseDeploymentResult } from "./deployment-result.mjs";

const ready = {
  id: "dpl_123abc",
  url: "example.vercel.app",
  readyState: "READY",
};
const expected = { id: ready.id, url: "https://example.vercel.app" };

test("accepts the flat JSON returned by CI", () => {
  assert.deepEqual(parseDeploymentResult(JSON.stringify(ready)), expected);
});
test("accepts the wrapped JSON returned in agent mode", () => {
  assert.deepEqual(
    parseDeploymentResult(
      JSON.stringify({
        status: "ok",
        deployment: { ...ready, url: expected.url },
      })
    ),
    expected
  );
});
test("rejects error responses even when they include a ready deployment", () => {
  for (const result of [
    { status: "error", deployment: ready },
    { ...ready, error: { name: "CHECKS_FAILED" } },
  ])
    assert.throws(
      () => parseDeploymentResult(JSON.stringify(result)),
      /unsuccessful/
    );
});
test("rejects unfinished and failed deployments before promotion", () => {
  for (const readyState of ["QUEUED", "BUILDING", "ERROR", undefined]) {
    assert.throws(
      () => parseDeploymentResult(JSON.stringify({ ...ready, readyState })),
      /not ready/
    );
  }
});
test("rejects missing identifiers and unsafe URLs", () => {
  for (const values of [
    { id: undefined },
    { url: undefined },
    { url: "http://example.vercel.app" },
    { url: "https://user:password@example.vercel.app" },
    { url: "example.vercel.app\tother" },
  ])
    assert.throws(() =>
      parseDeploymentResult(JSON.stringify({ ...ready, ...values }))
    );
});
test("rejects malformed JSON", () => {
  assert.throws(() => parseDeploymentResult("not JSON"));
});
