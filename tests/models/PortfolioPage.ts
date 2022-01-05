import { Page, Locator } from "@playwright/test";

export class PortfolioPage {
  readonly page: Page;
  readonly emptyStateTitle: Locator;
  readonly addAccountButton: Locator;
  readonly carousel: Locator;
  readonly carouselCloseButton: Locator;
  readonly carouselConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyStateTitle = page.locator('data-test-id=portfolio-empty-state-title');
    this.addAccountButton = page.locator('data-test-id=portfolio-empty-state-add-account-button');
    this.carousel = page.locator('data-test-id=carousel');
    this.carouselCloseButton = page.locator('data-test-id=carousel-close-button');
    this.carouselConfirmButton = page.locator('data-test-id=carousel-dismiss-confirm-button');
  }

  async openAddAccountModal() {
    await this.addAccountButton.click();
  }
}
