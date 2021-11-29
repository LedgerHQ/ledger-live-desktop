import { Page, Locator } from '@playwright/test';

export class PortfolioPage {
  readonly page: Page;
  readonly totalBalance: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalBalance = page.locator('[data-test-id="total-balance"]');
  }
};
