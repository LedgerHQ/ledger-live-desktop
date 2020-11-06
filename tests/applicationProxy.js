import fs from "fs";
import electronPath from "electron";
import path from "path";
import rimraf from "rimraf";
import { Application } from "spectron";

Application.prototype.startChromeDriver = function() {
  return {
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
};

const userDataPath = `${__dirname}/tmp/${Math.random()
  .toString(36)
  .substring(2, 5)}`;

export const removeUserData = () => {
  if (fs.existsSync(`${userDataPath}`)) {
    rimraf.sync(userDataPath);
  }
};

export function applicationProxy(envVar, userData = null) {
  fs.mkdirSync(userDataPath, { recursive: true });

  if (userData !== null) {
    const jsonFile = path.resolve("tests/setups/", `${userData}.json`);
    fs.copyFileSync(jsonFile, `${userDataPath}/app.json`);
  }

  const bundlePath = path.join(process.cwd(), "/.webpack/main.bundle.js");

  return new Application({
    path: electronPath,
    args: [bundlePath],
    chromeDriverArgs: [
      "--disable-extensions",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--lang=en",
      `--user-data-dir=${userDataPath}`,
    ],
    env: envVar,
    // webdriverLogPath: path.join(__dirname, "wd.log"),
    webdriverOptions: {
      capabilities: {
        "goog:chromeOptions": {
          binary: "/node_modules/spectron/lib/launcher.js",
          args: [
            "spectron-path=/node_modules/electron/dist/electron",
            "spectron-arg0=/app/.webpack/main.bundle.js",
            "spectron-env-MOCK=true",
            "spectron-env-DISABLE_MOCK_POINTER_EVENTS=true",
            "spectron-env-HIDE_DEBUG_MOCK=true",
            "spectron-env-DISABLE_DEV_TOOLS=true",
            "--disable-extensions",
            "--disable-dev-shm-usage",
            "--no-sandbox",
            "--lang=en",
            "--user-data-dir=/app/tests/tmp/0zl",
          ],
          debuggerAddress: undefined,
          windowTypes: ["app", "webview"],
        },
      },
    }
  });
}

export const getMockDeviceEvent = app => async (...events) => {
  return await app.client.execute(e => {
    window.mock.events.mockDeviceEvent(...e);
  }, events);
};
