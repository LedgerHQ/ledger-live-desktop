// @flow

import { fork } from "child_process";
import invariant from "invariant";
import type { ChildProcess } from "child_process";
import logger from "~/logger";

type Message = { type: string };
// eslint-disable-next-line camelcase
type ForkOptions = child_process$forkOpts;

class InternalProcess {
  process: ?ChildProcess;
  timeout: number;
  active: boolean;
  onStartCallback: ?Function;
  onMessageCallback: ?Function;
  onExitCallback: ?Function;
  messageQueue: Message[];
  password: string;
  path: string;
  args: ?(string[]);
  options: ?ForkOptions;

  constructor({ timeout }: { timeout: number }) {
    this.process = null;

    this.timeout = timeout;
    this.active = false;

    this.onStartCallback = null;
    this.onMessageCallback = null;
    this.onExitCallback = null;

    this.messageQueue = [];

    this.password = "";
  }

  onMessage(callback: Function) {
    this.onMessageCallback = callback;
  }

  onExit(callback: Function) {
    this.onExitCallback = callback;
  }

  run() {
    while (this.messageQueue.length && this.active && this.process) {
      const message = this.messageQueue.shift();
      invariant(this.process, "No internal process set");
      this.process.send(message);
    }
  }

  send(message: Message) {
    this.messageQueue.push(message);
    if (this.active) {
      this.run();
    }
  }

  onStart(callback: Function) {
    this.onStartCallback = callback;
  }

  configure(path: string, args: ?(string[]) = [], options: ?ForkOptions = {}) {
    this.path = path;
    this.args = args;
    this.options = options;
  }

  start() {
    if (this.process) {
      throw new Error("Internal process is already running !");
    }

    invariant(
      this.path && this.args && this.options,
      "configure() was not completed before start()",
    );
    this.process = fork(this.path, this.args, this.options);

    this.active = true;
    const pid = this.process.pid;

    logger.info(`spawned internal process ${pid}`);
    console.log(`spawned internal process ${pid}`);

    this.process && // A bit stupid, but Flow complains otherwise
      this.process.on("exit", (code, signal) => {
        this.process = null;

        if (code !== null) {
          console.log(`internal process ${pid} gracefully exited with code ${code}`);
          logger.info(`Internal process ${pid} ended with code ${code}`);
        } else {
          console.log(`internal process ${pid} got killed by signal ${signal}`);
          logger.info(`Internal process ${pid} killed with signal ${signal}`);
        }

        if (this.onExitCallback) {
          this.onExitCallback(code, signal, this.active);
        }
      });

    this.process && // And, yeah, even wrapping all this in a big if (this.process) isn't enough
      this.process.on("message", message => {
        if (this.onMessageCallback && this.active) {
          this.onMessageCallback(message);
        }
      });

    if (this.messageQueue.length) {
      this.run();
    }

    this.process && // You have to do this for every one of this.process.whatever 🤷‍♂️
      this.process.stdout.on("data", data =>
        String(data)
          .split("\n")
          .forEach(msg => {
            if (!msg) return;
            if (process.env.INTERNAL_LOGS) console.log(msg);
            try {
              const obj = JSON.parse(msg);
              if (obj && obj.type === "log") {
                logger.onLog(obj.log);
                return;
              }
            } catch (e) {}
            logger.debug("I: " + msg);
          }),
      );

    this.process &&
      this.process.stderr.on("data", data => {
        const msg = String(data).trim();
        if (__DEV__) console.error("I.e: " + msg);
        logger.error("I.e: " + String(data).trim());
      });

    if (this.onStartCallback) {
      this.onStartCallback();
    }
  }

  stop() {
    return new Promise<void, void>((resolve, reject) => {
      if (!this.process) {
        reject(new Error("Process not running"));
        return;
      }

      this.messageQueue = [];
      const pid = this.process.pid;

      logger.info(`ending process ${pid} ...`);
      console.log(`ending process ${pid} ...`);
      this.active = false;
      this.process &&
        this.process.once("exit", () => {
          resolve();
        });
      this.process && this.process.disconnect();
      setTimeout(() => {
        if (this.process && this.process.pid === pid) {
          this.process.kill("SIGKILL");
        }
      }, this.timeout);
    });
  }

  restart() {
    return this.stop().then(() => {
      this.start();
    });
  }
}

export default InternalProcess;
