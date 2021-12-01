import { Page, Locator, Handle, expect } from "@playwright/test";
import { PortfolioPage } from "./PortfolioPage";
export class AccountModal extends PortfolioPage {
  readonly page: Page;
  readonly addAccountButton: Locator;
  readonly modalContainer: Locator;
  readonly modalTitle: Locator;
  readonly selectAccount: Locator;
  readonly selectAccountInput: Locator;
  readonly continueButton: Locator;
  readonly addAccountsButton: Locator;
  readonly doneButton: Locator;
  readonly closeButton: Locator;
  readonly tokenAddAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.addAccountButton = page.locator('button:has-text("Add account")');
    this.modalContainer = page.locator('#modal-container[style="opacity: 1; transform: scale(1);"]');
    this.modalTitle = page.locator('#modal-title');
    this.selectAccount = page.locator("text=Choose a crypto asset");
    this.selectAccountInput = page.locator('[placeholder="Search"]');
    this.continueButton = page.locator('button:has-text("Continue")');
    this.addAccountsButton = page.locator('#add-accounts-import-add-button');
    this.doneButton = page.locator('#add-accounts-finish-close-button');
    this.closeButton = page.locator('#modal-close-button');
    this.tokenAddAccountButton = page.locator('#modal-token-continue-button');
  }

  async open() {
    await this.addAccountButton.click();
    expect(await this.modalTitle.textContent()).toBe("Add accounts");
    expect(await this.modalContainer.screenshot()).toMatchSnapshot(`open-modal.png`);
  }

  async select(currency: string) {
    await this.selectCurrency(currency);
    await this.continue();
  } 

  async selectCurrency(currency: string) {
    await this.selectAccount.click();
    await this.selectAccountInput.fill(currency);
    await this.selectAccountInput.press("Enter");
  }

  async continue() {
    await this.continueButton.click();
  }

  // Add ETH account button
  async continueParent() {
    await this.tokenAddAccountButton.click();
  }
  
  async addAccounts(currency: string) {
    await this.addAccountsButton.isEnabled();
    expect(await this.modalContainer.screenshot()).toMatchSnapshot(`${currency}-accounts-list.png`);
    await this.addAccountsButton.click();
    expect(await this.modalContainer.screenshot()).toMatchSnapshot(`${currency}-success.png`);
    await this.doneButton.click();
    await this.totalBalance.waitFor({ state: "visible" });
  }

  async complete() {
    await this.addAccountsButton.click();
    await this.doneButton.click();
  }

  async close() {
    await this.closeButton.click();
  }


}
