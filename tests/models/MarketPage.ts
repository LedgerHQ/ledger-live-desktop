import { Page, Locator } from "@playwright/test";

export class MarketPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly counterValueSelect: Locator;
  readonly marketRangeSelect: Locator;
  readonly filterDrawerButton: Locator;
  readonly starFilterButton: Locator;
  readonly sortButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator("data-test-id=market-search-input");
    this.counterValueSelect = page.locator("text=US Dollar - USD");
    this.marketRangeSelect = page.locator("text=24h");
    this.filterDrawerButton = page.locator("data-test-id=market-filter-drawer-button");
    this.starFilterButton = page.locator("data-test-id=market-star-button");
    this.sortButton = page.locator("data-test-id=market-sort-button");
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async openFilterDrawer() {
    await this.filterDrawerButton.click();
  }

  async toggleInvertSort() {
    await this.sortButton.click();
  }

  async switchCountervalue(ticker: string) {
    await this.counterValueSelect.click();
    // TODO: For some reason need to hack selects like that
    await this.page.click('#react-select-2-listbox div div:has-text("Thai Baht - THB")');
  }

  async switchMarketRange(range: string) {
    await this.marketRangeSelect.click();
    // TODO: For some reason need to hack selects like that
    await this.page.click(`text=${range}`);
  }

  async toggleStarFilter() {
    await this.starFilterButton.click();
  }

  async starCoin(ticker: string) {
    const starButton = this.page.locator(`data-test-id=market-${ticker}-star-button`);
    await starButton.click();
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
