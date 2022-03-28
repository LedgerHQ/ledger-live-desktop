import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { DiscoverPage } from "../models/DiscoverPage";
import { Layout } from "../models/Layout";
import { DeviceAction } from "../models/DeviceAction";
import { Modal } from "../models/Modal";

// Comment out to disable recorder
// process.env.PWDEBUG = "1";

test.use({ userdata: "1AccountBTC1AccountETH" });

let continueTest = false;

test.beforeAll(async ({ request }) => {
  // Check that dummy app in tests/utils/dummy-app-build has been started successfully (see playwright.config.ts 'webServer' option for more info)
  try {
    const response = await request.get("http://localhost:3001");
    if (response.ok() === true) {
      continueTest = true;
      console.info("========> Dummy test app successfully running on port 3001! <=========");
    }
  } catch (error) {
    console.warn("========> Dummy test app not running on port 3001! <=========");
  }
});

// Due to flakiness on different OS's and CI, we won't run the screenshots where unncessary for testing
test.skip("Live App", async ({ page }) => {
  // Don't run test if server is not running
  if (!continueTest) return;

  const discoverPage = new DiscoverPage(page);
  const layout = new Layout(page);
  const device = new DeviceAction(page);
  const modal = new Modal(page);

  await test.step("Navigate to catalog", async () => {
    await discoverPage.navigateToCatalog();
    // expect(await page.screenshot()).toMatchSnapshot({
    //   name: "catalog.png",
    // });
  });

  await test.step("Open Test App", async () => {
    await discoverPage.openTestApp();
    await discoverPage.waitForDisclaimerToBeVisible();
    // expect(await page.screenshot()).toMatchSnapshot({
    //   name: "open-test-app.png",
    // });
  });

  await test.step("Accept Live App Disclaimer", async () => {
    await discoverPage.acceptLiveAppDisclaimer();
    await layout.waitForLoadingSpinnerToDisappear();
    await discoverPage.waitForDisclaimerToBeHidden;
    // expect(await page.screenshot()).toMatchSnapshot({
    //   name: "live-disclaimer-accepted.png",
    // });
  });

  await test.step("List all accounts", async () => {
    await discoverPage.getAccountsList();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-list-all-accounts.png",
    });
  });

  await test.step("Request Account modal - open", async () => {
    await discoverPage.requestAccount();
    await discoverPage.waitForSelectAccountModalToBeVisible();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-request-account-modal-1.png",
    });
  });

  await test.step("Request Account - account dropdown", async () => {
    await discoverPage.openAccountDropdown();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-request-account-modal-2.png",
    });
  });

  await test.step("Request Account - select BTC", async () => {
    await discoverPage.selectAccount();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-request-account-modal-3.png",
    });
  });

  await test.step("Request Account - single account output", async () => {
    await discoverPage.exitModal();
    await discoverPage.letLiveAppLoad();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-request-single-account-output.png",
    });
  });

  await test.step("Verify Address", async () => {
    await discoverPage.verifyAddress();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-verify-account.png",
    });
  });

  await test.step("Verify Address - connect nano", async () => {
    await device.openApp();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-verify-account-connect-nano.png",
    });
    await device.complete(); // so the mock device is shut and doesn't cause issues with later tests
  });

  await test.step("Verify Address - get address", async () => {
    await modal.waitForModalToDisappear();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "live-app-verify-account-get-address.png",
    });
  });
});
