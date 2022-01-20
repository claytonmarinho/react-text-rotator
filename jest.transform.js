const { createTransformer } = require("babel-jest").default;

const transformer = createTransformer({
  presets: ["@babel/env", "@babel/preset-react"],
});

module.exports = transformer;
