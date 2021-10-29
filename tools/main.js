#!/usr/bin/env node
const Electron = require("./utils/Electron");
const WebpackWorker = require("./utils/WebpackWorker");
const WebpackBar = require("webpackbar");
const webpack = require("webpack");
const yargs = require("yargs");
const nodeExternals = require("webpack-node-externals");
const childProcess = require("child_process");

const pkg = require("./../package.json");

const NIGHTLY = pkg.name.includes("nightly");

const { SENTRY_URL } = process.env;

const GIT_REVISION = childProcess
  .execSync("git rev-parse --short HEAD")
  .toString("utf8")
  .trim();

// TODO: ADD BUNDLE ANALYZER

const bundles = {
  renderer: {
    name: "renderer",
    wpConf: require("../renderer.webpack.config"),
    color: "teal",
  },
  main: {
    name: "main",
    wpConf: require("../main.webpack.config"),
    color: "orange",
  },
  preloader: {
    name: "preloader",
    wpConf: require("../preloader.webpack.config"),
    color: "purple",
  },
  webviewPreloader: {
    name: "webviewPreloader",
    wpConf: require("../webviewPreloader.webpack.config"),
    color: "yellow",
  },
};

const buildMainEnv = (mode, config, argv) => {
  const env = {
    __DEV__: JSON.stringify(mode === "development"),
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_REVISION__: JSON.stringify(GIT_REVISION),
    __SENTRY_URL__: JSON.stringify(SENTRY_URL || null),
    __NIGHTLY__: NIGHTLY,
  };

  if (mode === "development") {
    env.INDEX_URL = JSON.stringify(`http://localhost:${argv.port}/webpack/index.html`);
  }

  return env;
};

const buildRendererEnv = (mode, config) => {
  const env = {
    __DEV__: JSON.stringify(mode === "development"),
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_REVISION__: JSON.stringify(GIT_REVISION),
    __SENTRY_URL__: JSON.stringify(SENTRY_URL || null),
    __NIGHTLY__: NIGHTLY,
  };

  return env;
};

const buildRendererConfig = (mode, config, argv) => {
  const { wpConf, color, name } = config;

  const entry =
    mode === "development"
      ? Array.isArray(wpConf.entry)
        ? ["webpack-hot-middleware/client", ...wpConf.entry]
        : ["webpack-hot-middleware/client", wpConf.entry]
      : wpConf.entry;

  const plugins =
    mode === "development"
      ? [...wpConf.plugins, new webpack.HotModuleReplacementPlugin()]
      : wpConf.plugins;

  const alias =
    mode === "development"
      ? { ...wpConf.resolve.alias, "react-dom": "@hot-loader/react-dom" }
      : wpConf.resolve.alias;

  const module = {
    ...wpConf.module,
    rules:
      mode === "development" || process.env.INSTRUMENT_BUILD
        ? [
            ...wpConf.module.rules,
            {
              test: /\.js$/,
              use: {
                loader: "istanbul-instrumenter-loader",
                options: { esModules: true },
              },
              enforce: "post",
              exclude: /node_modules|tests/,
            },
          ]
        : wpConf.module.rules,
  };

  return {
    ...wpConf,
    mode: mode === "production" ? "production" : "development",
    devtool: mode === "development" ? "eval-source-map" : "none",
    entry,
    plugins: [
      ...plugins,
      new WebpackBar({ name, color }),
      new webpack.DefinePlugin(buildRendererEnv(mode, wpConf, argv)),
    ],
    node: {
      __dirname: false,
      __filename: false,
    },
    resolve: {
      ...wpConf.resolve,
      alias,
    },
    output: {
      ...wpConf.output,
      publicPath: mode === "production" ? "./" : "/webpack",
    },
    module,
  };
};

const buildMainConfig = (mode, config, argv) => {
  const { wpConf, color, name } = config;
  return {
    ...wpConf,
    mode: mode === "production" ? "production" : "development",
    devtool: mode === "development" ? "eval-source-map" : "none",
    externals: [nodeExternals()],
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins: [
      ...wpConf.plugins,
      new WebpackBar({ name, color }),
      new webpack.DefinePlugin(buildMainEnv(mode, wpConf, argv)),
    ],
  };
};

const startDev = async argv => {
  const mainWorker = new WebpackWorker("main", buildMainConfig("development", bundles.main, argv));
  const preloaderWorker = new WebpackWorker(
    "preloader",
    buildMainConfig("development", bundles.preloader, argv),
  );
  const webviewPreloaderWorker = new WebpackWorker(
    "webviewPreloader",
    buildMainConfig("development", bundles.webviewPreloader, argv),
  );
  const rendererWorker = new WebpackWorker(
    "renderer",
    buildRendererConfig("development", bundles.renderer),
  );
  const electron = new Electron("./.webpack/main.bundle.js");

  await Promise.all([
    mainWorker.watch(() => {
      electron.reload();
    }),
    preloaderWorker.watch(() => {
      electron.reload();
    }),
    webviewPreloaderWorker.watch(() => {
      electron.reload();
    }),
    rendererWorker.serve(argv.port),
  ]);
  electron.start();
};

const build = async argv => {
  const mainConfig = buildMainConfig("production", bundles.main, argv);
  const preloaderConfig = buildMainConfig("production", bundles.preloader, argv);
  const webviewPreloaderConfig = buildMainConfig("production", bundles.webviewPreloader, argv);
  const rendererConfig = buildRendererConfig("production", bundles.renderer, argv);

  const mainWorker = new WebpackWorker("main", mainConfig);
  const rendererWorker = new WebpackWorker("renderer", rendererConfig);
  const preloaderWorker = new WebpackWorker("preloader", preloaderConfig);
  const webviewPreloaderWorker = new WebpackWorker("preloader", webviewPreloaderConfig);

  await Promise.all([
    mainWorker.bundle(),
    rendererWorker.bundle(),
    preloaderWorker.bundle(),
    webviewPreloaderWorker.bundle(),
  ]);
};

yargs
  .usage("Usage: $0 <command> [options]")
  .command({
    command: ["dev", "$0"],
    desc: "start the development workflow",
    builder: yargs =>
      yargs.option("port", {
        alias: "p",
        type: "number",
        default: 8080,
      }),
    handler: startDev,
  })
  .command({
    command: "build",
    desc: "build the app for production",
    handler: build,
  })
  .help("h")
  .alias("h", "help")
  .parse();
