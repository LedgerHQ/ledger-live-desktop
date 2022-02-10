import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../models/Layout";
import { measurePerformanceInMs } from "../utils/performance-utils";

test.use({
  userdata: "allLiveCoinsNoOperations",
  env: {
    // DEV_TOOLS: true,
    MOCK: undefined,
    HIDE_RELEASE_NOTES: true,
  },
});

// process.env.PWDEBUG = "1";

test("Performance while sync", async ({ page }) => {
  const results = [];

  const layout = new Layout(page);

  const syncLoadingSpinner = await page.locator("data-test-id=sync-loading-spinner");
  if (!syncLoadingSpinner) {
    return;
  }

  const accountNavigation = await measurePerformanceInMs(layout.goToAccounts(), "Accounts");
  const swapNavigation = await measurePerformanceInMs(layout.goToSwap(), "Swap");
  const marketNavigation = await measurePerformanceInMs(layout.goToMarket(), "Market");

  console.log({ accountNavigation });
  console.log({ swapNavigation });
  console.log({ marketNavigation });

  results.push(accountNavigation);
  results.push(swapNavigation);
  results.push(marketNavigation);

  console.table(results);

  const jsonResults = JSON.stringify(results);

  console.log(jsonResults);

  expect(true).toBeTruthy();
});
