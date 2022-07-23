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
  rules: {},
  plugins: ["@typescript-eslint"],
  ignorePatterns: [".next/*", "build/*", ".eslintrc.js", "next.config.js"],
};
