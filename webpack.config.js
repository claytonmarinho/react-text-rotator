const path = require("path");

module.exports = (env) => ({
  entry: path.resolve(process.cwd(), "src/index.js"),
  target: "node",
  devtool: env.env === "dev" ? "inline-source-map" : undefined,
  mode: env.env === "dev" ? "development" : "production",
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
    modules: ["node_modules"],
  },
  output: {
    path: path.resolve(process.cwd(), "lib"),
    filename: "index.js",
    libraryTarget: "umd",
  },
});
