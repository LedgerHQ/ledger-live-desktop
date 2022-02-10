import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { PortfolioPage } from "../models/PortfolioPage";

test.use({ userdata: "allLiveCoinsNoOperations", env: { DEV_TOOLS: true, MOCK: undefined } });

test("Performance while sync", async ({ page }) => {
  const portfolioPage = new PortfolioPage(page);

  await page.pause();
});
