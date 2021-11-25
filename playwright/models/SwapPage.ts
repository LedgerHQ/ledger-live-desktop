import { Page, Locator, expect } from '@playwright/test';

export class SwapPage {
  readonly page: Page;
  readonly swapMenuButton: Locator;
  readonly maxSpendableToggle: Locator;
  readonly exchangeButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.swapMenuButton = page.locator('#drawer-swap-button');
    this.maxSpendableToggle = page.locator('data-test-id=swap-max-spendable-toggle');
    this.exchangeButton = page.locator('data-test-id=exchange-button');
  }

  async navigate() {
    await this.swapMenuButton.click();
    await this.maxSpendableToggle.waitFor({ state: 'visible' });
  }

  async sendMax() {
    await this.maxSpendableToggle.click();
  }

  async confirmExchange() {
    await this.exchangeButton.click();
  }
}