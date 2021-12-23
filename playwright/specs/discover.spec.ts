import test from "../fixtures/common";
import { chromium, expect } from "@playwright/test";
import { DiscoverPage } from "../models/DiscoverPage";
// import { UploadDummyApp } from "../../src/renderer/screens/settings/sections/Developer/TestApp/UploadDummyApp.js";

// Comment out to disable recorder
process.env.PWDEBUG = "1";

test.use({ userdata: "1AccountBTC1AccountETH", env: { DEV_TOOLS: true } });
// test.use({ env: { DUMMY_LIVE_APP: "../test-live-app/manifest.json" } });

test.beforeAll(async () => {});

// test.describe("Discover", ({ page }) => {

test("Navigate to live app", async ({ page }) => {
  const discoverPage = new DiscoverPage(page);
  await discoverPage.navigateToCatalog();
  await discoverPage.openTestApp();
  await page.pause();
  await discoverPage.acceptLiveAppDisclaimer();
  await page.pause();

  //   // // Open new page
  const context = await page.context();
  const page2 = await context.newPage();
  await page2.goto('http://localhost:3001/?theme=light&backgroundColor=%23FFFFFF&textColor=rgb%2820%2C+37%2C+51%29');
  // Go to http://localhost:3001/?theme=light&backgroundColor=%23FFFFFF&textColor=rgb%2820%2C+37%2C+51%29
  await page2.goto('http://localhost:3001/?theme=light&backgroundColor=%23FFFFFF&textColor=rgb%2820%2C+37%2C+51%29');

  expect(true).toBeTruthy();
});
// });
