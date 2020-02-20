const path = require("path");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const babelPlugins = require("./babel.plugins");
const UnusedWebpackPlugin = require("unused-webpack-plugin");

const babelConfig = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-flow",
  ],
  plugins: babelPlugins,
};

module.exports = {
  target: "electron-main",
  optimization: {
    minimize: false,
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, ".webpack"),
    filename: "main.bundle.js",
  },
  plugins: [
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(__dirname, ".webpack", "cacheMain"),
    }),
    new UnusedWebpackPlugin({
      directories: [path.join(__dirname, "src/main"), path.join(__dirname, "src/internal")],
      exclude: ["*.test.js", "*.html", "updater/*"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: babelConfig,
      },
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
};
