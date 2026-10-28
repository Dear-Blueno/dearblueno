const { BASELINE_API_URL, CANDIDATE_API_URL } = process.env;
if (!BASELINE_API_URL || !CANDIDATE_API_URL)
  throw new Error("Set BASELINE_API_URL and CANDIDATE_API_URL");
const paths = [
  "/",
  "/posts?sort=new",
  "/posts?sort=hot",
  "/posts/search?query=Brown",
];
const report = [];
for (const path of paths) {
  const measure = async (base, headers = {}) => {
    const values = [];
    for (let i = 0; i < 21; i++) {
      const start = performance.now();
      const response = await fetch(new URL(path, base), {
        signal: AbortSignal.timeout(10000),
        headers,
      });
      await response.arrayBuffer();
      if (!response.ok)
        throw new Error(`Benchmark HTTP ${response.status} on ${path}`);
      values.push(performance.now() - start);
    }
    const first = values.shift();
    values.sort((a, b) => a - b);
    return {
      firstRequestMs: first,
      warmP95Ms: values[Math.ceil(values.length * 0.95) - 1],
    };
  };
  const baseline = await measure(BASELINE_API_URL),
    candidate = await measure(
      CANDIDATE_API_URL,
      process.env.CANDIDATE_PROTECTION_BYPASS
        ? {
            "x-vercel-protection-bypass":
              process.env.CANDIDATE_PROTECTION_BYPASS,
          }
        : {}
    );
  const passed =
    candidate.warmP95Ms <=
      Math.max(baseline.warmP95Ms * 1.25, baseline.warmP95Ms + 100) &&
    candidate.firstRequestMs < 2000;
  report.push({ path, baseline, candidate, passed });
}
console.info(JSON.stringify(report, null, 2));
if (report.some((row) => !row.passed)) process.exitCode = 1;
// First request is a proxy for cold latency; confirm actual cold starts in Vercel logs.
