import { Page, Locator } from "@playwright/test";

export class SideDrawer {
  readonly page: Page;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.closeButton = page.locator("data-test-id=sidedrawer-close-button");
  }

  async closeDrawer() {
    await this.closeButton.click();
  }
}
