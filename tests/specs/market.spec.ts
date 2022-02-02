import { expect } from "@playwright/test";

import test from "../fixtures/common";
import { MarketPage } from "../models/MarketPage";
import { Layout } from "../models/Layout";
import { MarketCoinPage } from "../models/MarketCoinPage";

test.use({ userdata: "skip-onboarding" });

test("Market", async ({ page }) => {
  const marketPage = new MarketPage(page);
  const marketCoinPage = new MarketCoinPage(page);
  const layout = new Layout(page);

  await test.step("go to market", async () => {
    await layout.goToMarket();
    expect(await page.screenshot()).toMatchSnapshot("market-page.png");
  });

  await test.step("go to market -> bitcoin", async () => {
    await marketPage.openCoinPage("btc");
    expect(await page.screenshot()).toMatchSnapshot("market-btc-page.png");
  });

  await test.step("go to market -> bitcoin -> buy", async () => {
    await marketCoinPage.openBuyPage();
    expect(await page.screenshot()).toMatchSnapshot("market-btc-buy-page.png");
  });

  await test.step("go to market", async () => {
    await layout.goToMarket();
    expect(await page.screenshot()).toMatchSnapshot("market-page.png");
  });

  await test.step("go to market -> buy bitcoin", async () => {
    await marketPage.openBuyPage("btc");
    expect(await page.screenshot()).toMatchSnapshot("market-btc-buy-page.png");
  });
});
