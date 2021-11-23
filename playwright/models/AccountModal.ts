import { Page, Locator, expect } from "@playwright/test";

export class AccountModal {
  readonly page: Page;
  readonly accountsMenu: Locator;
  readonly addAccountButton: Locator;
  readonly modalTitle: Locator;
  readonly selectAccount: Locator;
  readonly selectAccountInput: Locator;
  readonly continueButton: Locator;
  readonly addAccountsButton: Locator;
  readonly doneButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountsMenu = page.locator('#drawer-menu-accounts');
    this.addAccountButton = page.locator('button:has-text("Add account")');
    this.modalTitle = page.locator("#modal-title");
    this.selectAccount = page.locator(".select__indicator");
    this.selectAccountInput = page.locator('[placeholder="Search"]');
    this.continueButton = page.locator('button:has-text("Continue")');
    this.addAccountsButton = page.locator('button:has-text("Add accounts")');
    this.doneButton = page.locator('button:has-text("Done")');
  }

  async navigate() {
    await this.accountsMenu.click();
  }

  async open() {
    await this.addAccountButton.click();
    await this.modalTitle.waitFor({ state: "visible" });
    expect(await this.modalTitle.textContent()).toBe("Add accounts");
  }

  async select(currency: string) {
    await this.selectAccount.click();
    await this.selectAccountInput.fill(currency);
    await this.selectAccountInput.press("Enter");
    await this.continueButton.click();
  }

  async complete() {
    await this.addAccountsButton.click();
    await this.doneButton.click();
  }
}
