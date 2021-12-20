import { Page, Locator } from "@playwright/test";

export class PortfolioPage {
  readonly page: Page;
  readonly addAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addAccountButton = page.locator('data-test-id=portfolio-empty-state-add-account-button');
  }

  async openAddAccountModal() {
    await this.addAccountButton.click();
  }
}
