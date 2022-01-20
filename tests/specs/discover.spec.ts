import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { DiscoverPage } from "../models/DiscoverPage";

// Comment out to disable recorder
// process.env.PWDEBUG = "1";

test.use({ userdata: "1AccountBTC1AccountETH" });

// TODO: Remove test app here

test.beforeAll(async () => {
  // Can start dummy app here?
  // perhaps add new script in package.json to also kickoff test app
});

// TODO: tidy up test and add more features to test app before making test run
test("Live SDK", async ({ page }) => {
  const discoverPage = new DiscoverPage(page);

  await test.step("Navigate to catalog", async () => {
    // await page.pause();
    await discoverPage.navigateToCatalog();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "catalog.png",
    });
  });

  await test.step("Open Test App", async () => {
    await discoverPage.openTestApp();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "open-test-app.png",
    });
  });

  await test.step("Accept Live App Disclaimer", async () => {
    await discoverPage.acceptLiveAppDisclaimer();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "accept-live-disclaimer.png",
    });
  });

  await test.step("List all accounts", async () => {
    // await page.pause();
    // FIXME: wrong screenshot
    await discoverPage.getAccountsList();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-list-all-accounts.png",
    });
  });

  await test.step("Request Account modal - open", async () => {
    // await page.pause();
    await discoverPage.requestAccount();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-request-account-modal-1.png",
    });
  });

  await test.step("Request Account - account dropdown", async () => {
    // await page.pause();
    await discoverPage.openAccountDropdown();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-request-account-modal-2.png",
    });
  });

  await test.step("Request Account - select BTC", async () => {
    // await page.pause();
    await discoverPage.selectAccount();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-request-account-modal-3.png",
    });
  });

  await test.step("Request Account - single account output", async () => {
    // await page.pause();
    await discoverPage.exitModal();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-request-single-account-output.png",
    });
  });
});
