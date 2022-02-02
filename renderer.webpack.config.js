const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const babelPlugins = require("./babel.plugins");
const UnusedWebpackPlugin = require("unused-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const babelConfig = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          electron: "7.1.9",
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-flow",
  ],
  plugins: [
    ...babelPlugins,
    "react-hot-loader/babel",
    [
      "babel-plugin-styled-components",
      {
        ssr: false,
      },
    ],
  ],
};
const babelTsConfig = {
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        targets: {
          electron: "7.1.9",
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-flow",
  ],
  plugins: [
    ...babelPlugins,
    "react-hot-loader/babel",
    [
      "babel-plugin-styled-components",
      {
        ssr: false,
      },
    ],
  ],
};

module.exports = {
  target: "electron-renderer",
  entry: ["./src/renderer/index.js"],
  output: {
    path: path.resolve(__dirname, ".webpack"),
    filename: "renderer.bundle.js",
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/renderer/index.html",
      filename: "index.html",
      title: "Ledger Live",
    }),
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(__dirname, ".webpack", "cacheRenderer"),
    }),
    new UnusedWebpackPlugin({
      directories: [path.join(__dirname, "src/renderer")],
      exclude: [
        "*.test.js",
        "*.html",
        "bridge/proxy-commands.js",
        "fonts/inter/Inter-Bold.woff2",
        "types.js",
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: babelTsConfig,
      },
      {
        test: /\.js$/i,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: babelConfig,
      },
      {
        test: /\.js$/i,
        loader: require.resolve('@open-wc/webpack-import-meta-loader'),
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      process.env.V3
        ? {
            test: /\.woff2/,
            use: [
              {
                loader: "file-loader",
                options: {
                  name: "[name].[ext]",
                  outputPath: "assets/fonts/",
                },
              },
            ],
          }
        : {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            use: ["file-loader"],
          },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            fallback: require.resolve("file-loader"),
          },
        },
      },
      {
        type: "javascript/auto",
        test: /\.mjs$/,
        use: [],
      },
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
    ...(process.env.V3
      ? {
          extensions: [
            ".v3.tsx",
            ".v3.ts",
            ".v3.jsx",
            ".v3.js",
            ".tsx",
            ".ts",
            ".jsx",
            ".js",
            "...",
          ],
        }
      : {
          extensions: [
            ".jsx",
            ".js",
            ".v3.tsx",
            ".v3.ts",
            ".v3.jsx",
            ".v3.js",
            ".tsx",
            ".ts",
            "...",
          ],
        }),
  },
};
