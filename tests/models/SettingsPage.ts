import { Page, Locator } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly accountsTab: Locator;
  readonly aboutTab: Locator;
  readonly helpTab: Locator;
  readonly experimentalTab: Locator;
  readonly experimentalDevModeToggle: Locator;
  readonly carouselSwitchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountsTab = page.locator('data-test-id=settings-accounts-tab');
    this.aboutTab = page.locator('data-test-id=settings-about-tab');
    this.helpTab = page.locator('data-test-id=settings-help-tab');
    this.experimentalTab = page.locator('data-test-id=settings-experimental-tab');
    this.experimentalDevModeToggle = page.locator('data-test-id=MANAGER_DEV_MODE-button');
    this.carouselSwitchButton = page.locator('data-test-id=settings-carousel-switch-button');
  }

  async goToAccountsTab() {
    await this.accountsTab.click();
  }

  async goToAboutTab() {
    await this.aboutTab.click();
  }

  async goToHelpTab() {
    await this.helpTab.click();
  }

  async goToExperimentalTab() {
    await this.experimentalTab.click();
  }

  async enableDevMode() {
    await this.experimentalDevModeToggle.click();
  }
}
