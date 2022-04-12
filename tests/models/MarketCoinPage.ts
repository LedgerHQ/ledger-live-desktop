import { Page, Locator } from "@playwright/test";

export class MarketCoinPage {
  readonly page: Page;
  readonly buyButton: Locator;
  readonly swapButton: Locator;
  readonly counterValueSelect: Locator;
  readonly marketRangeSelect: Locator;
  readonly starFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buyButton = page.locator("data-test-id=market-coin-buy-button");
    this.swapButton = page.locator("data-test-id=market-coin-swap-button");
    this.counterValueSelect = page.locator("data-test-id=market-coin-counter-value-select");
    this.marketRangeSelect = page.locator("data-test-id=market-coin-range-select");
    this.starFilterButton = page.locator("data-test-id=market-coin-star-button");
  }

  async openBuyPage() {
    await this.buyButton.click();
  }

  async openSwapPage() {
    await this.swapButton.click();
  }
}
