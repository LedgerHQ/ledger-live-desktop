import { Page, expect } from '@playwright/test';

export class SwapPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.click('#drawer-swap-button');
  }
}