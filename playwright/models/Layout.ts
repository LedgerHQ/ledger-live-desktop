import { Page, Locator } from '@playwright/test';

export class Layout {
  readonly page: Page;
  readonly totalBalance: Locator;
  readonly loadingLogo: Locator;
  readonly logo: Locator;
  readonly inputError: Locator;
  readonly inputWarning: Locator;
  readonly drawerCollapseButton: Locator;
  readonly drawerPortfolioButton: Locator;
  readonly drawerAccountsButton: Locator;
  readonly drawerSendButton: Locator;
  readonly drawerReceiveButton: Locator;
  readonly drawerManagerButton: Locator;
  readonly drawerBuycryptoButton: Locator;
  readonly drawerExperimentalButton: Locator;
  readonly topbarDiscreetButton: Locator;
  readonly topbarSynchronizeButton: Locator;
  readonly topbarSettingsButton: Locator;
  readonly topbarLockButton: Locator;
  readonly bookmarkedAccountsList: Locator;

  constructor(page: Page) {
    this.page = page;

    // portfolio
    this.totalBalance = page.locator('data-test-id=total-balance');

    // drawer
    this.drawerCollapseButton = page.locator('data-test-id=drawer-collapse-button');
    this.drawerPortfolioButton = page.locator('data-test-id=drawer-dashboard-button');
    this.drawerAccountsButton = page.locator('data-test-id=drawer-accounts-button');
    this.drawerSendButton = page.locator('data-test-id=drawer-send-button');
    this.drawerReceiveButton = page.locator('data-test-id=drawer-receive-button');
    this.drawerManagerButton = page.locator('data-test-id=drawer-manager-button');
    this.drawerBuycryptoButton = page.locator('data-test-id=drawer-exchange-button');
    this.drawerExperimentalButton = page.locator('data-test-id=drawer-experimental-button');
    this.bookmarkedAccountsList = page.locator("data-test-id=bookmarked-accounts");

    // topbar
    this.topbarDiscreetButton = page.locator('data-test-id=topbar-discreet-button');
    this.topbarSynchronizeButton = page.locator('data-test-id=topbar-synchronize-button');
    this.topbarSettingsButton = page.locator('data-test-id=topbar-settings-button');
    this.topbarLockButton = page.locator('data-test-id=topbar-password-lock-button');
    
    // general
    this.loadingLogo = page.locator('id=loading-logo');
    this.logo = page.locator("data-test-id=logo");
    this.inputError = page.locator('id=input-error'); // no data-test-id because css style is applied
    this.inputWarning = page.locator('id=input-warning'); // no data-test-id because css style is applied
  }

  async goToPortfolio() {
    await this.drawerPortfolioButton.click();
  }

  async goToAccounts() {
    await this.drawerAccountsButton.click();
  }

  async goToManager() {
    await this.drawerManagerButton.click();
  }

  async goToBuyCrypto() {
    await this.drawerBuycryptoButton.click();
  }

  async toggleDiscreetMode() {
    await this.topbarDiscreetButton.click();
  }

  async goToSettings() {
    await this.topbarSettingsButton.click();
  }

  async lockApp() {
    await this.topbarLockButton.click();
  }
};
