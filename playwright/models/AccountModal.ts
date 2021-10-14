import { Page } from '@playwright/test';

export class AccountModal {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.click('#drawer-menu-accounts');
  }

  async add() {
    await this.page.click('button:has-text("Add account")');
  }

  async select(currency) {
    await this.page.click('#modal-content >> :nth-match(div:has-text("Choose a crypto asset"), 3)');
    await this.page.click(`text=${currency}`);
    await this.page.click('button:has-text("Continue")');
  }

  async complete() {
    await this.page.click('button:has-text("Add accounts")');
    await this.page.click('button:has-text("Done")');
  }
};
