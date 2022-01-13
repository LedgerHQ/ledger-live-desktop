import { Page, Locator } from "@playwright/test";

export class AccountsPage {
  readonly page: Page;
  readonly addAccountButton: Locator;
  readonly accountsPageTitle: Locator;
  readonly accountsList: Locator;
  readonly accountsSearchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addAccountButton = page.locator("data-test-id=accounts-add-account-button");
    this.accountsPageTitle = page.locator("data-test-id=accounts-title");
    this.accountsList = page.locator("data-test-id=accounts-list");
    this.accountsSearchInput = page.locator("data-test-id=accounts-search-input");
  }

  async openAddAccountModal() {
    await this.addAccountButton.click();
  }

  async getPageTitle() {
    await this.accountsPageTitle.textContent();
  }

  async openAccount(account: string) {
    await this.accountsList.locator(`text="${account}"`).click();
  }
}
