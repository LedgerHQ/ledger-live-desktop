import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { PortfolioPage } from "../models/PortfolioPage";

test.use({ userdata: "allLiveCoinsNoOperations", env: { MOCK: false } });

test("Performance while sync", async ({ page }) => {
  const portfolioPage = new PortfolioPage(page);

  await page.page();
});
