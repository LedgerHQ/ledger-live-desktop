import { Page, Locator } from "@playwright/test";
import { Modal } from "./Modal";

export class AddAccountModal extends Modal {
  readonly page: Page;
  readonly addAccountButton: Locator;
  readonly selectAccount: Locator;
  readonly selectAccountInput: Locator;
  readonly addAccountsButton: Locator;
  readonly stopButton: Locator;
  readonly retryButton: Locator;
  readonly addMoreButton: Locator;
  readonly doneButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.addAccountButton = page.locator('data-test-id=portfolio-empty-state-add-account-button');
    this.selectAccount = page.locator("text=Choose a crypto asset"); // FIXME: I need an id
    this.selectAccountInput = page.locator('[placeholder="Search"]'); // FIXME: I need an id
    this.addAccountsButton = page.locator('data-test-id=add-accounts-import-add-button');
    this.retryButton = page.locator('data-test-id=add-accounts-import-retry-button');
    this.stopButton = page.locator('data-test-id=add-accounts-import-stop-button');
    this.addMoreButton = page.locator('data-test-id=add-accounts-finish-add-more-button');
    this.doneButton = page.locator('data-test-id=add-accounts-finish-close-button');
  }

  async open() {
    await this.addAccountButton.click();
  }

  async select(currency: string) {
    await this.selectAccount.click();
    await this.selectAccountInput.fill(currency);
    await this.selectAccountInput.press("Enter");
  }

  async addAccounts() {
    await this.addAccountsButton.click();
  }

  async done() {
    await this.doneButton.click();
  }
}
