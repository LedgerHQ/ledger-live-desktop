#!/usr/bin/env node

const execa = require("execa");
const Listr = require("listr");

const tasks = new Listr(
  [
    {
      title: "Run eslint",
      task: async () => {
        try {
          const { stdout } = await execa("yarn", ["lint"]);
          return stdout;
        } catch (error) {
          process.stderr.write(error.message);
          throw new Error("eslint test failed");
        }
      },
    },
    {
      title: "Run prettier check",
      task: async () => {
        try {
          const { stdout } = await execa("yarn", ["prettier:check"]);
          return stdout;
        } catch (error) {
          process.stderr.write(error.message);
          throw new Error("prettier test failed");
        }
      },
    },
    {
      title: "Run flow",
      task: async () => {
        try {
          const { stdout } = await execa("yarn", ["flow"]);
          return stdout;
        } catch (error) {
          process.stderr.write(error.message);
          throw new Error("flow test failed");
        }
      },
    },
  ],
  { concurrent: true, exitOnError: false },
);

tasks.run().catch(() => {
  process.exit(-1);
});
