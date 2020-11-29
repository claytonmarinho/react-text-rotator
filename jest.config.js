module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.js$": "./jest.transform.js",
  },
};
