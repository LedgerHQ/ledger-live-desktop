import { waitForExpectedText } from "../helpers.js";
import { applicationProxy, getConfigPath, getScreenshotPath } from "../applicationProxy.js";
import * as selector from "../selectors.js";
import * as step from "../scenarios.js";

import { toMatchImageSnapshot } from "jest-image-snapshot";

const path = require("path");
const fs = require("fs");

expect.extend({ toMatchImageSnapshot });

let app;

const TIMEOUT = 50 * 1000;

const tmpAppJSONPath = path.resolve(getConfigPath(), "app.json");
const accountsOperations = '"operations":[{';

describe(
  "Start LL after verion update, Release Note, Check password lock",
  () => {
    beforeAll(async () => {
      app = applicationProxy("ethXtzXrp.json", { SKIP_ONBOARDING: "1" });
      await app.start();
    }, TIMEOUT);

    afterAll(async () => {
      if (app && app.isRunning()) {
        await app.stop();
      }
    }, TIMEOUT);

    test(
      "App start",
      async () => {
        await step.applicationStart(app);
      },
      TIMEOUT,
    );

    test(
      "Terms of use modal should be displayed",
      async () => {
        await step.termsOfUse(app);
      },
      TIMEOUT,
    );

    // test(
    //   'Release Note should be displayed',
    //   async () => {
    //     await step.releaseNote(app)
    //   },
    //   TIMEOUT,
    // )

    test(
      "Dashboard: Portfolio should show Graph, Assets, Operations",
      async () => {
        await step.dashboard(app);
        const image = await app.client.saveScreenshot(getScreenshotPath("portfolio"));
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.05,
          failureThresholdType: "percent",
        });
      },
      TIMEOUT,
    );

    test(
      "Click setting icon -> Check General settings",
      async () => {
        await step.generalSettings(app);
        const image = await app.client.saveScreenshot(getScreenshotPath("generalSettings_On"));
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.02,
          failureThresholdType: "percent",
        });
      },
      TIMEOUT,
    );

    test(
      "Enable password lock should Encrypt user data",
      async () => {
        await app.client.click(selector.button_passwordLock);
        await waitForExpectedText(app, selector.modal_title, "Password lock");
        await waitForExpectedText(app, selector.setPassword_title, "Set a password");
        let image = await app.client.saveScreenshot(getScreenshotPath("setPassword"));
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.02,
          failureThresholdType: "percent",
        });

        await app.client.setValue(selector.input_newPassword, 5);
        await app.client.setValue(selector.input_confirmPassword, 5);
        await app.client.keys("Enter");
        await waitForExpectedText(app, selector.settings_title, "Settings");
        await app.client.pause(1000);
        image = await app.client.saveScreenshot(getScreenshotPath("generalSettings_passwordOn"));
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.02,
          failureThresholdType: "percent",
        });
        const LockedfileContent = fs.readFileSync(tmpAppJSONPath, "utf-8");
        await expect(LockedfileContent).not.toContain(accountsOperations);
      },
      TIMEOUT,
    );

    test(
      "Disable password lock should Decrypt user data",
      async () => {
        await app.client.click(selector.button_passwordLock);
        await waitForExpectedText(app, selector.modal_title, "Disable password lock");
        await app.client.setValue("#password", 5);
        await app.client.pause(500);
        const image = await app.client.saveScreenshot(getScreenshotPath("disablePassword"));
        expect(image).toMatchImageSnapshot({
          failureThreshold: 0.05,
          failureThresholdType: "percent",
        });
        await app.client.keys("Enter");
        await waitForExpectedText(app, selector.settings_title, "Settings");
        await app.client.pause(3000);
        const UnlockedfileContent = fs.readFileSync(tmpAppJSONPath, "utf-8");
        await expect(UnlockedfileContent).toContain(accountsOperations);
        await app.client.pause(1000);
      },
      TIMEOUT,
    );
  },
  TIMEOUT,
);
