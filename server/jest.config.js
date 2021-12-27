const { defaults: tsjPreset } = require("ts-jest/presets");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "@shelf/jest-mongodb",
  // ...some other non related config values...
  transform: tsjPreset.transform,
  testEnvironment: "node",
};
