// @flow

import { fork } from "child_process";
import invariant from "invariant";
import type { ChildProcess } from "child_process";
import logger from "~/logger";

type Message = { type: string };
// eslint-disable-next-line camelcase
type ForkOptions = child_process$forkOpts;

const logType = { type: "InternalProcess" };

class InternalProcess {
  process: ?ChildProcess;
  timeout: number;
  active: boolean;
  libcoreInitialized: boolean;
  onStartCallback: ?Function;
  onMessageCallback: ?Function;
  onExitCallback: ?Function;
  messageQueue: Message[];
  password: string;
  path: string;
  args: ?(string[]);
  options: ?ForkOptions;

  startPromise: { resolve?: Function, reject?: Function };

  constructor({ timeout }: { timeout: number }) {
    this.process = null;

    this.timeout = timeout;
    this.active = false;
    this.libcoreInitialized = false;

    this.onStartCallback = null;
    this.onMessageCallback = null;
    this.onExitCallback = null;

    this.messageQueue = [];

    this.password = "";

    this.startPromise = {};
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

  setPassword(password: string) {
    if (password !== this.password) {
      this.password = password;
      logger.info("Libcore password set", logType);

      if (this.process) {
        return this.restart();
      }
    }
  }

  changePassword(newPassword: string) {
    logger.info("Changing Libcore password", logType);

    if (!this.libcoreInitialized || !this.process) {
      throw new Error("Can't change password if libcore is not unlocked first!");
    }

    this.process.send({
      type: "changeLibcorePassword",
      currentPassword: this.password,
      newPassword,
    });

    this.password = newPassword;
  }

  start() {
    logger.info("Started internal process", logType);

    return new Promise<any>((resolve, reject) => {
      if (this.process) {
        throw new Error("Internal process is already running !");
      }

      if (!this.path || !this.args || !this.options) {
        throw new Error("configure() was not completed before start()");
      }

      const proc = fork(this.path, this.args, this.options);

      this.process = proc;
      this.startPromise = { resolve, reject };
      this.active = true;

      const { pid } = proc;

      logger.info(`spawned internal process ${pid}`, logType);

      proc.on("exit", (code, signal) => {
        this.process = null;

        if (code !== null) {
          logger.info(`Internal process ${pid} ended with code ${code}`, logType);
        } else {
          logger.warn(`Internal process ${pid} killed with signal ${signal}`, logType);
        }

        if (this.active && !this.libcoreInitialized) {
          logger.warn("Libcore failed to initialize", logType);
          this.startPromise.reject && this.startPromise.reject();
        }

        if (this.onExitCallback) {
          this.onExitCallback(
            code,
            signal,
            this.active && this.libcoreInitialized,
            this.libcoreInitialized,
          );
        }

        this.active = false;
        this.libcoreInitialized = false;
      });

      proc.on("message", message => {
        if (message.type === "libcoreInitialized") {
          logger.info("Libcore initialized successfully", logType);
          this.libcoreInitialized = true;

          this.startPromise.resolve && this.startPromise.resolve();

          if (this.onStartCallback) {
            this.onStartCallback();
          }
        }
        if (this.onMessageCallback && this.active) {
          this.onMessageCallback(message);
        }
      });

      if (this.messageQueue.length) {
        this.run();
      }

      proc.stdout.on("data", data =>
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
            logger.debug("I: " + msg, { type: "internal-stdout" });
          }),
      );

      proc.stderr.on("data", data => {
        const msg = String(data).trim();
        if (__DEV__) console.error("I.e: " + msg);
        logger.error("I.e: " + String(data).trim(), { type: "internal-stderr" });
      });

      proc.send({ type: "initLibcore", password: this.password });
    });
  }

  stop() {
    return new Promise<void, void>((resolve, reject) => {
      if (!this.process) {
        reject(new Error("Process not running"));
        return;
      }

      this.messageQueue = [];
      const pid = this.process.pid;

      logger.info(`ending process ${pid} ...`, logType);
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

  async restart() {
    await this.stop();
    await this.start();
  }
}

export default InternalProcess;
