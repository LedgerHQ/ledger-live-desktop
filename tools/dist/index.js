#!/usr/bin/env node
// @flow

const yargs = require("yargs");
const execa = require("execa");
const Listr = require("listr");
const verboseRenderer = require("listr-verbose-renderer");
const path = require("path");
const rimraf = require("rimraf");

const Draft = require("./draft");
const healthChecksTasks = require("./health-checks");

require("dotenv").config();

const rootFolder = "../../";
let verbose = false;

const exec = async (file, args, options = {}) => {
  const opts = verbose ? { stdio: "inherit", ...options } : options;

  return execa(file, args, opts);
};

const rmDir = dir =>
  new Promise((resolve, reject) => {
    const fullPath = path.resolve(__dirname, rootFolder, dir);

    rimraf(fullPath, error => {
      if (error) return reject(error);
      resolve();
    });
  });

const cleaningTasks = args => [
  {
    title: "Remove `node_modules/.cache` folder",
    task: () => rmDir("node_modules/.cache"),
  },
  {
    title: "Remove `.webpack` folder",
    task: () => rmDir(".webpack"),
  },
  {
    title: "Remove `dist` folder",
    task: () => rmDir("dist"),
  },
];

const setupTasks = args => [
  {
    title: "Installing packages",
    task: async () => {
      await exec("yarn", ["-s", "--frozen-lockfile"]);
    },
  },
];

const buildTasks = args => [
  {
    title: "Compiling assets",
    task: async () => {
      await exec("yarn", ["build"]);
    },
  },
  {
    title: args.publish
      ? "Bundling and publishing the electron application"
      : "Bundling the electron application",
    task: async () => {
      const commands = ["dist:internal"];
      if (args.dir) commands.push("--dir");
      if (args.publish) {
        commands.push("--publish", "always");
      } else {
        commands.push("-c.afterSign='lodash/noop'");
        commands.push("--publish", "never");
      }
      if (args.n) {
        commands.push("--config");
        commands.push("electron-builder-nightly.yml");
      }

      await exec("yarn", commands);
    },
  },
];

const draftTasks = args => {
  let draft;

  return [
    {
      title: "Authenticate on GitHub",
      task: ctx => {
        const { repo, tag, token } = ctx;
        draft = new Draft(repo, tag, token);
      },
    },
    {
      title: "Check if draft already exists",
      task: async ctx => {
        ctx.draftExists = await draft.check();
      },
    },
    {
      title: "Create draft on GitHub",
      skip: ctx => (ctx.draftExists ? "Draft already exists." : false),
      task: () => draft.create(),
    },
  ];
};

const mainTask = (args = {}) => {
  const { dirty, publish } = args;

  const tasks = [
    {
      title: "Health checks",
      enabled: () => !!publish,
      task: () => setupList(healthChecksTasks, args),
    },
    {
      title: "Cleanup",
      skip: () => (dirty ? "--dirty flag passed" : false),
      task: () => setupList(cleaningTasks, args),
    },
    {
      title: "Setup",
      skip: () => (dirty ? "--dirty flag passed" : false),
      task: () => setupList(setupTasks, args),
    },
    {
      title: "Prepare release on GitHub",
      enabled: () => !!publish,
      task: () => setupList(draftTasks, args),
    },
    {
      title: publish ? "Build and publish" : "Build",
      task: () => setupList(buildTasks, args),
    },
  ];

  return tasks;
};

const setupList = (getTasks, args) => {
  verbose = !!args.verbose;

  const tasks = getTasks(args);
  const options = {
    collapse: false,
    renderer: verbose ? verboseRenderer : undefined,
  };

  return new Listr(tasks, options);
};

const runTasks = (getTasks, args) => {
  const listr = setupList(getTasks, args);

  listr.run().catch(error => {
    console.error(error);
    process.exit(-1);
  });
};

yargs
  .usage("Usage: $0 <command> [options]")
  .command(
    ["build", "$0"],
    "bundles the electron app",
    yargs =>
      yargs
        .option("dir", {
          type: "boolean",
          describe: "Build unpacked dir. Useful for tests",
        })
        .option("n", {
          alias: "nightly",
          type: "boolean",
        })
        .option("dirty", {
          type: "boolean",
          describe: "Don't clean-up and rebuild dependencies before building",
        })
        .option("publish", {
          type: "boolean",
          describe: "Publish the created artifacts on GitHub as a draft release",
        }),
    args => runTasks(mainTask, args),
  )
  .command(
    "check",
    "Run health checks",
    () => {},
    args => runTasks(healthChecksTasks, args),
  )
  .option("verbose", {
    alias: "v",
    type: "boolean",
    describe: "Do not pretty print progress (ncurses) and display output from called commands",
  })
  .help("help")
  .alias("help", "h")
  .strict(true)
  .parse();
