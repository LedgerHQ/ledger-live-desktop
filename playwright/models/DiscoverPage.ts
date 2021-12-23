import { Page, Locator, expect } from "@playwright/test";

export class DiscoverPage {
  readonly page: Page;
  readonly discoverMenuButton: Locator;
  readonly testAppCatalogItem: Locator;
  readonly liveAppDisclaimerContinueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.discoverMenuButton = page.locator("data-test-id=drawer-catalog-button");
    this.testAppCatalogItem = page.locator("#platform-catalog-app-test-live-app");
    this.liveAppDisclaimerContinueButton = page.locator("data-test-id=live-app-disclaimer-continue");
  }

  async navigateToCatalog() {
    await this.discoverMenuButton.click();
  }

  async openTestApp() {
    await this.testAppCatalogItem.click();
  }

  async acceptLiveAppDisclaimer() {
    await this.liveAppDisclaimerContinueButton.click();
  }

  // // Open new page
  // const page2 = await context.newPage();
  // await page2.goto('http://localhost:3001/?theme=light&backgroundColor=%23FFFFFF&textColor=rgb%2820%2C+37%2C+51%29');
  // // Go to http://localhost:3001/?theme=light&backgroundColor=%23FFFFFF&textColor=rgb%2820%2C+37%2C+51%29
  // await page2.goto('http://localhost:3001/?theme=light&backgroundColor=%23FFFFFF&textColor=rgb%2820%2C+37%2C+51%29');
}
