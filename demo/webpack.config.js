const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = () => ({
  entry: path.resolve(process.cwd(), "demo/src/index.js"),
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
    path: path.resolve(process.cwd(), "demo/dist"),
    filename: "index.js",
  },
  plugins: [new HtmlWebpackPlugin({ template: "./demo/src/index.html" })],
  devServer: {
    contentBase: path.join(__dirname, "demo/dist"),
    hot: true,
    port: 3000,
  },
});
