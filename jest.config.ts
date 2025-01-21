import type { Config } from "jest";

const config: Config = {
  roots: ["<rootDir>/src"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageProvider: "v8",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};

export default config;
