import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../models/Layout";
import { measurePerformanceInMs } from "../utils/performance-utils";

test.use({
  userdata: "allLiveCoinsNoOperations",
  env: { DEV_TOOLS: true, MOCK: undefined, HIDE_RELEASE_NOTES: true },
});

// process.env.PWDEBUG = "1";

test("Performance while sync", async ({ page }) => {
  const layout = new Layout(page);

  const syncLoadingSpinner = await page.locator("data-test-id=sync-loading-spinner");
  if (!syncLoadingSpinner) {
    return;
  }

  await measurePerformanceInMs(layout.goToAccounts(), "Accounts");
  await measurePerformanceInMs(layout.goToSwap(), "Swap");

  expect(true).toBeTruthy();
});
