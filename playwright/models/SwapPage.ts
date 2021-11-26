import { Page, Locator, expect } from '@playwright/test';

export class SwapPage {
  readonly page: Page;
  readonly swapMenuButton: Locator;
  readonly maxSpendableToggle: Locator;
  readonly exchangeButton: Locator;
  readonly swapId: Locator;
  readonly seeDetailsButton: Locator;
  readonly detailsSwapId: Locator;
  readonly sideDrawerCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.swapMenuButton = page.locator('#drawer-swap-button');
    this.maxSpendableToggle = page.locator('data-test-id=swap-max-spendable-toggle');
    this.exchangeButton = page.locator('data-test-id=exchange-button');
    this.swapId = page.locator('data-test-id=swap-id');
    this.seeDetailsButton = page.locator('button:has-text("See details")');
    this.detailsSwapId = page.locator('data-test-id=details-swap-id');
    this.sideDrawerCloseButton = page.locator('.sidedrawer-close');
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

  async verifySuccessfulExchange() {
    await this.swapId.waitFor({ state: 'visible'});
    return this.swapId.innerText();
  }

  async verifyExchangeDetails() {
    await this.seeDetailsButton.click();
    await this.detailsSwapId.waitFor({ state: 'visible'});
    return this.detailsSwapId.innerText();
  }

  async exitExchangeDrawer() {
    await this.sideDrawerCloseButton.click();
  }
}