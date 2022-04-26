import { Page, Locator } from '@playwright/test';
import { Layout } from './Layout';

export class SettingsPage extends Layout {
  readonly page: Page;
  readonly accountsTab: Locator;
  readonly aboutTab: Locator;
  readonly helpTab: Locator;
  readonly experimentalTab: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.accountsTab = page.locator('data-test-id=settings-accounts-tab');
    this.aboutTab = page.locator('data-test-id=settings-about-tab');
    this.helpTab = page.locator('data-test-id=settings-help-tab');
    this.experimentalTab = page.locator('data-test-id=settings-experimental-tab');
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
}
