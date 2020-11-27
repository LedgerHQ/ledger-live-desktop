import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { Application } from "spectron";
import _ from "lodash";

Application.prototype.startChromeDriver = function() {
  this.chromeDriver = {
    start: () => {
      return Promise.resolve();
    },
    stop: () => {
      return Promise.resolve();
    },
    clearLogs: () => {
      return [];
    },
    getLogs: () => {},
  };
  return this.chromeDriver.start();
};

const userDataPathKey = Math.random()
  .toString(36)
  .substring(2, 5);
const userDataPath = path.join(__dirname, "tmp", userDataPathKey);

export const removeUserData = dump => {
  if (fs.existsSync(`${userDataPath}`)) {
    if (dump) {
      fs.copyFileSync(`${userDataPath}/app.json`, path.join(__dirname, "dump.json"));
    }
    rimraf.sync(userDataPath);
  }
};

export function applicationProxy(userData = null, env = {}) {
  fs.mkdirSync(userDataPath, { recursive: true });

  env = Object.assign(
    {
      MOCK: true,
      DISABLE_MOCK_POINTER_EVENTS: true,
      HIDE_DEBUG_MOCK: true,
      DISABLE_DEV_TOOLS: true,
      SPECTRON_RUN: true,
    },
    env,
  );

  if (userData !== null) {
    const jsonFile = path.resolve("tests/setups/", `${userData}.json`);
    fs.copyFileSync(jsonFile, `${userDataPath}/app.json`);
  }

  return new Application({
    path: require("electron"), // just to make spectron happy since we override everything below
    waitTimeout: 15000,
    webdriverOptions: {
      capabilities: {
        "goog:chromeOptions": {
          binary: "/app/node_modules/spectron/lib/launcher.js",
          args: [
            "spectron-path=/app/node_modules/electron/dist/electron",
            "spectron-arg0=/app/.webpack/main.bundle.js",
            "--disable-extensions",
            "--disable-dev-shm-usage",
            "--no-sandbox",
            "--lang=en",
            `--user-data-dir=/app/tests/tmp/${userDataPathKey}`,
          ].concat(_.map(env, (value, key) => `spectron-env-${key}=${value.toString()}`)),
          debuggerAddress: undefined,
          windowTypes: ["app", "webview"],
        },
      },
    },
  });
}

export const getMockDeviceEvent = app => async (...events) => {
  return await app.client.execute(e => {
    window.mock.events.mockDeviceEvent(...e);
  }, events);
};
