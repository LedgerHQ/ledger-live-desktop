import {
  deviceInfo155 as deviceInfo,
  mockListAppsResult,
} from "@ledgerhq/live-common/lib/apps/mock";
import { Application } from "spectron";
import _ from "lodash";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import ModalPage from "./po/modal.page";
import fs from "fs";
import rimraf from "rimraf";
import path from "path";

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

const getMockDeviceEvent = app => async (...events) => {
  return await app.client.execute(e => {
    window.mock.events.mockDeviceEvent(...e);
  }, events);
};

let app;
let modalPage;
let mockDeviceEvent;

expect.extend({ toMatchImageSnapshot });
jest.setTimeout(600000);

// eslint-disable-next-line jest/no-export
export default function initialize(name, { userData, env = {}, disableStartSnap = false }) {
  const userDataPathKey = Math.random()
    .toString(36)
    .substring(2, 5);
  const userDataPath = path.join(__dirname, "tmp", userDataPathKey);

  const removeUserData = dump => {
    if (fs.existsSync(`${userDataPath}`)) {
      if (dump) {
        fs.copyFileSync(`${userDataPath}/app.json`, path.join(__dirname, "dump.json"));
      }
      rimraf.sync(userDataPath);
    }
  };

  beforeAll(async () => {
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

    if (userData) {
      const jsonFile = path.resolve("tests/setups/", `${userData}.json`);
      fs.copyFileSync(jsonFile, `${userDataPath}/app.json`);
    }

    app = new Application({
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
              "--disable-gpu",
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

    modalPage = new ModalPage(app);
    mockDeviceEvent = getMockDeviceEvent(app);

    try {
      await app.start();
      await app.client.waitUntilWindowLoaded();
    } catch (e) {
      console.log("app start error", e);
    }

    app.client.addCommand("waitForSync", async () => {
      const sync = await app.client.$("#topbar-synchronized");
      await sync.waitForDisplayed();
    });

    app.client.addCommand("screenshot", async function(countdown = 500) {
      this.pause(countdown);

      const pageRect = await app.client.execute(() => {
        return {
          height: document.getElementById("page-scroller")
            ? document.getElementById("page-scroller").scrollHeight
            : 0,
          offsetHeight: document.getElementById("page-scroller")
            ? document.getElementById("page-scroller").offsetHeight
            : 0,
          oWidth: window.innerWidth,
          oHeight: window.innerHeight,
        };
      });

      const height = Math.max(
        pageRect.oHeight,
        pageRect.oHeight + pageRect.height - pageRect.offsetHeight,
      );

      await this.browserWindow.setContentSize(pageRect.oWidth, height);

      const capture = await this.browserWindow.capturePage();

      await this.browserWindow.setContentSize(pageRect.oWidth, pageRect.oHeight);

      return capture;
    });
  });

  afterAll(async () => {
    const coverage = await app.client.execute(() => {
      return window.__coverage__;
    });
    fs.writeFileSync(
      path.join(
        __dirname,
        "coverage",
        path.basename(require.main.filename).replace(/\//g, "-") + "on",
      ),
      JSON.stringify(coverage),
    );
    await app.stop();
    removeUserData(process.env.SPECTRON_DUMP_APP_JSON);
  });

  if (!disableStartSnap) {
    it("should start in this state", async () => {
      await app.client.$("__app__ready__");
      await app.client.pause(1000);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `__start__${name}`,
      });
    });
  }
}

// eslint-disable-next-line jest/no-export
export { app, deviceInfo, mockListAppsResult, mockDeviceEvent, modalPage };
