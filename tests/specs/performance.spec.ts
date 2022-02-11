import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../models/Layout";
import { measurePerformanceInMs } from "../utils/performance-utils";
import * as fs from "fs";
import * as path from "path";
import { generateUUID } from "../fixtures/common";

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

  const accountNavigation = await measurePerformanceInMs(
    layout.goToAccounts(),
    "Navigate to Accounts",
  );
  const swapNavigation = await measurePerformanceInMs(layout.goToSwap(), "Navigate to Swap");
  const marketNavigation = await measurePerformanceInMs(layout.goToMarket(), "Navigate to Market");

  results.push(accountNavigation);
  results.push(swapNavigation);
  results.push(marketNavigation);

  console.table(results);

  const jsonResults = JSON.stringify(results);

  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`;

  fs.writeFileSync(
    path.join(
      "tests/artifacts/performance-results",
      `performance-results-${dateString}-${generateUUID()}.json`,
    ),
    jsonResults,
  );

  expect(true).toBeTruthy();
});
