import { Page, Locator } from "@playwright/test";

export class MarketPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly counterValueSelect: Locator;
  readonly marketRangeSelect: Locator;
  readonly filterDrawerButton: Locator;
  readonly starFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator("data-test-id=market-search-input");
    this.counterValueSelect = page.locator("data-test-id=market-counter-value-select");
    this.marketRangeSelect = page.locator("data-test-id=market-range-select");
    this.filterDrawerButton = page.locator("data-test-id=market-filter-drawer-button");
    this.starFilterButton = page.locator("data-test-id=market-star-button");
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async openFilterDrawer() {
    await this.filterDrawerButton.click();
  }

  async openCoinPage(ticker: string) {
    const coinRow = this.page.locator(`data-test-id=market-${ticker}-row`);
    await coinRow.click();
  }

  async openBuyPage(ticker: string) {
    const buyButton = this.page.locator(`data-test-id=market-${ticker}-buy-button`);
    await buyButton.click();
  }
}
