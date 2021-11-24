import { Page, Locator } from "@playwright/test";

export class DiscoverPage {
  readonly page: Page;
  readonly discoverMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.discoverMenu = page.locator('#drawer-catalog-button');
  }

  async navigate() {
    await this.discoverMenu.click();
  }
}