import { Page, Locator, expect } from "@playwright/test";

export class DiscoverPage {
  readonly page: Page;
  readonly discoverMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.discoverMenuButton = page.locator("data-test-id=drawer-discover-button");
  }

  async navigate() {
    await this.discoverMenuButton.click();
  }
}
