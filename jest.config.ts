import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  moduleDirectories: ["node_modules", "<rootDir>"],
  modulePathIgnorePatterns: [
    "<rootDir>/.next",
    "<rootDir>/dist",
  ],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", {
      tsconfig: {
        allowJs: true,
      },
    }],
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!change-case)",
  ],
  collectCoverage: true,
};

export default jestConfig;
