const path = require("path");

module.exports = {
  entry: path.join(__dirname, "src", "index.js"),
  target: "node",
  mode: "production",
  externals: ["react", "react-dom", "react-transition-group", "prop-types"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /lib/, /demo/],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  regenerator: true,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js"],
    modules: [path.join(__dirname, "node_modules")],
  },
  output: {
    path: path.join(__dirname, "lib"),
    filename: "index.js",
    libraryTarget: "umd",
  },
};
