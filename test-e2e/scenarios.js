import { waitForDisappear, waitForExpectedText } from "./helpers.js";
import { getScreenshotPath } from "./applicationProxy.js";
import * as selector from "./selectors.js";

import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

// App should start
export async function applicationStart(app) {
  const title = await app.client.getTitle();
  expect(title).toEqual("Ledger Live");
  await app.client.waitUntilWindowLoaded();
  await waitForDisappear(app, "#preload");
}

export async function termsOfUse(app) {
  const titleModal = await app.client.getText(selector.modal_title);
  expect(titleModal).toEqual("Terms of Use");
  let image = await app.client.saveScreenshot(getScreenshotPath("termsOfUse_off"));
  expect(image).toMatchImageSnapshot({
    failureThreshold: 0.05,
    failureThresholdType: "percent",
  });
  expect(await app.client.isEnabled(selector.button_continue)).toEqual(false);
  await app.client.click(selector.checkbox_termsOfUse);
  await app.client.pause(1000);
  image = await app.client.saveScreenshot(getScreenshotPath("termsOfUse_on"));
  expect(image).toMatchImageSnapshot({
    failureThreshold: 0.05,
    failureThresholdType: "percent",
  });
  expect(await app.client.isEnabled(selector.button_continue)).toEqual(true);
  await waitForExpectedText(app, selector.button_continue, "Confirm");
  await app.client.click(selector.button_continue);
}

export async function releaseNote(app) {
  await waitForExpectedText(app, selector.modal_title, "Release notes");
  await app.client.pause(1000);
  const image = await app.client.saveScreenshot(getScreenshotPath("releaseNote"));
  expect(image).toMatchImageSnapshot({
    failureThreshold: 0.05,
    failureThresholdType: "percent",
  });
  await app.client.click(selector.button_closeReleaseNote);
}

// Dashboard
export async function dashboard(app) {
  await waitForExpectedText(app, selector.portfolio_assetDistribution_tile, "Asset allocation (");
  const lastOperations = await app.client.getText(selector.portfolio_operationList_title);
  expect(lastOperations).toEqual("Last operations");
  await app.client.pause(2000);
}

// Settings
export async function generalSettings(app) {
  await app.client.click(selector.button_settings);
  await waitForExpectedText(app, selector.settings_title, "Settings");
  await waitForExpectedText(app, selector.settingsSection_title, "General");
  await app.client.click(selector.button_reportBug);
  await app.client.click(selector.button_shareAnalytics);
}
// Send step 1
export async function sendFlow(app, currency) {
  await app.client.click(selector.sidebar_send);
  await waitForExpectedText(app, selector.modal_title, "Send");
  await app.client.setValue(selector.account_to_debit, currency);
  await app.client.keys("Enter");
}
