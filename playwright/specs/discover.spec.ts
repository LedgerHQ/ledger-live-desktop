import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { DiscoverPage } from "../models/DiscoverPage";
import { UploadDummyApp } from "../../src/renderer/screens/settings/sections/Developer/TestApp/UploadDummyApp.js";

// Comment out to disable recorder
process.env.PWDEBUG = "1";

test.use({ userdata: "1AccountBTC1AccountETH", env: { DEV_TOOLS: true } });
// test.use({ env: { DUMMY_LIVE_APP: "../test-live-app/manifest.json" } });

test.beforeAll(async () => {
  const testAppPath = "../test-live-app/manifest.json";
  UploadDummyApp(testAppPath);
});

// test.describe("Discover", ({ page }) => {

test("Navigate to live app", async ({ page }) => {
  const discoverPage = new DiscoverPage(page);
  await discoverPage.navigate();
  await page.pause();
  expect(true).toBeTrue();
});
// });
