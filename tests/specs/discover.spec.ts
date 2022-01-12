import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { DiscoverPage } from "../models/DiscoverPage";

// Comment out to disable recorder
// process.env.PWDEBUG = "1";

test.use({ userdata: "1AccountBTC1AccountETH" });

test.beforeAll(async () => {
  // Can start dummy app here?
});

test("Navigate to live app", async ({ page }) => {
  const discoverPage = new DiscoverPage(page);
  await discoverPage.navigateToCatalog();
  await discoverPage.openTestApp();
  await discoverPage.acceptLiveAppDisclaimer();
  // await page.pause();
  await discoverPage.requestAccount();
  expect(await page.screenshot()).toMatchSnapshot({
    name: "live-app-request-account-modal.png",
  });
});
