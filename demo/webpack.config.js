const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const distPath = path.join(__dirname, "dist");

module.exports = () => ({
  entry: path.join(__dirname, "src", "index.js"),
  target: "web",
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: [/node_modules/],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    path: distPath,
    filename: "index.js",
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
  resolve: {
    modules: [path.join(__dirname, "node_modules")],
  },
  devServer: {
    static: distPath,
  },
});
