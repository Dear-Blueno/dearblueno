module.exports = {
  env: {
    es2021: true,
    browser: true,
  },
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@next/next/no-img-element": "off",
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: [
    ".next/*",
    "build/*",
    ".eslintrc.js",
    "next.config.js",
    "/public/precache.*.*.js",
    "/public/sw.js",
    "/public/workbox-*.js",
    "/public/worker-*.js",
    "/public/fallback-*.js",
    "/public/precache.*.*.js.map",
    "/public/sw.js.map",
    "/public/workbox-*.js.map",
    "/public/worker-*.js.map",
    "/public/fallback-*.js.map",
  ],
};
