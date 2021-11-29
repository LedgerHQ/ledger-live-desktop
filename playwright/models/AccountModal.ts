import { Page, Locator, Handle, expect } from "@playwright/test";
import { PortfolioPage } from "./PortfolioPage";
export class AccountModal extends PortfolioPage {
  readonly page: Page;
  readonly accountsMenu: Locator;
  readonly addAccountButton: Locator;
  readonly modalContainer: Locator;
  readonly modalTitle: Locator;
  readonly selectAccount: Locator;
  readonly selectAccountInput: Locator;
  readonly continueButton: Locator;
  readonly addAccountsButton: Locator;
  readonly doneButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.accountsMenu = page.locator('#drawer-menu-accounts');
    this.addAccountButton = page.locator('button:has-text("Add account")');
    this.modalContainer = page.locator('#modal-container');
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
    // FIXME: css animation; opacity=1 after 200ms; try later with waitForElementState
    await this.page.waitForTimeout(200);
    expect(await this.modalTitle.textContent()).toBe("Add accounts");
    expect(await this.modalContainer.screenshot()).toMatchSnapshot(`open-modal.png`);
  }

  async select(currency: string) {
    await this.selectAccount.click();
    await this.selectAccountInput.fill(currency, {delay: 100});
    await this.selectAccountInput.press("Enter");
    expect(await this.modalContainer.screenshot()).toMatchSnapshot(`${currency}-select.png`);
    await this.continueButton.click();
  }

  async addAccounts(currency: string) {
    await this.addAccountsButton.isEnabled();
    expect(await this.modalContainer.screenshot()).toMatchSnapshot(`${currency}-accounts-list.png`);
    await this.addAccountsButton.click();
    expect(await this.modalContainer.screenshot()).toMatchSnapshot(`${currency}-success.png`);
    await this.doneButton.click();
    await this.totalBalance.waitFor({ state: "visible" });
  }
}
