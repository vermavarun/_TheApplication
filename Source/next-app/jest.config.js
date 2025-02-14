const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // Support for absolute imports
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock styles
  },
};

module.exports = createJestConfig(customJestConfig);
