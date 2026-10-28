// Preserve native import(): Vercel's require hook cannot load ky's ESM entrypoint.
module.exports = () => import("google-spreadsheet");
