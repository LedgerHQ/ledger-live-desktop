import { Page, Locator } from "@playwright/test";
import { Layout } from "./Layout";

export class PortfolioPage extends Layout {
  readonly page: Page;
  readonly addAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.addAccountButton = page.locator('data-test-id=portfolio-empty-state-add-account-button');
  }

  async openAddAccountModal() {
    await this.addAccountButton.click();
  }
}
