import { Page, expect } from '@playwright/test';

export class AccountModal {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.click('#drawer-menu-accounts');
  }

  async open() {
    await this.page.click('button:has-text("Add account")');
    await this.page.waitForSelector('#modal-title', { state: 'visible' } );
    expect(await this.page.textContent('#modal-title')).toBe("Add accounts");
  }

  async select(currency) {
    await this.page.click('.select__indicator');
    await this.page.fill('[placeholder="Search"]', currency);
    await this.page.press('[placeholder="Search"]', 'Enter');
    await this.page.click('button:has-text("Continue")');
  }

  async complete() {
    await this.page.click('button:has-text("Add accounts")');
    await this.page.click('button:has-text("Done")');
  }
};
