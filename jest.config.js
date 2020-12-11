module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  testMatch: ["**/tests/**/*.[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.js$": "./jest.transform.js",
  },
};
