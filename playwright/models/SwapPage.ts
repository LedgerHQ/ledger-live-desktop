import { Page, expect } from '@playwright/test';

export class SwapPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.click('#drawer-swap-button');
    await this.page.waitForSelector('data-test-id=swap-max-spendable-toggle', { state: 'visible' });
  }

  async sendMax() {
    await this.page.click('data-test-id=swap-max-spendable-toggle');
  }

  async confirmExchange() {
    await this.page.click('data-test-id=exchange-button');
  }
}