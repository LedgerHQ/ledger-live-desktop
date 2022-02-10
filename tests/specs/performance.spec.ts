import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { PortfolioPage } from "../models/PortfolioPage";

test.use({ userdata: "allLiveCoinsNoOperations", env: { DEV_TOOLS: true, MOCK: undefined } });

test("Performance while sync", async ({ page }) => {
  const portfolioPage = new PortfolioPage(page);

  const continueButton = await page.locator("text='Continue'");
  if (continueButton) {
    continueButton.click();
  }

  const syncLoadingSpinner = await page.locator("text='Continue'");
  if (!syncLoadingSpinner) {
    return;
  }

  await page.pause();
});
