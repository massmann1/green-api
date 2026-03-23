module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxWorkers: 1,
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.spec.ts"],
  setupFiles: ["<rootDir>/src/config/load-env.ts"]
};
