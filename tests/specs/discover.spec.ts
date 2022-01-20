import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { DiscoverPage } from "../models/DiscoverPage";

// Comment out to disable recorder
process.env.PWDEBUG = "1";

test.use({ userdata: "1AccountBTC1AccountETH", env: { DEV_TOOLS: true } });

test.beforeAll(async () => {
  // Can start dummy app here?
  // perhaps add new script in package.json to also kickoff test app
});

// TODO: tidy up test and add more features to test app before making test run
test("Navigate to live app", async ({ page }) => {
  const discoverPage = new DiscoverPage(page);
  await discoverPage.navigateToCatalog();
  await discoverPage.openTestApp();
  await discoverPage.acceptLiveAppDisclaimer();
  await page.pause();
  await discoverPage.requestAccount();
  expect(await page.screenshot()).toMatchSnapshot({
    name: "live-app-request-account-modal.png",
  });
});
