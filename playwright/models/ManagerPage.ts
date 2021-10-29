import { Page } from '@playwright/test';

export class ManagerPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.click('#drawer-manager-button');
  }

  async goToInstalledAppTab() {
    await this.page.click('#appsOnDevice-tab');
  }

  async goToCatalogTab() {
    await this.page.click('#appCatalog-tab');
  }

  async updateAllApps() {
    await this.page.click('#managerAppsList-updateAll');
    await this.page.waitForSelector('text=Updating...', { state: "detached" });
  }

  async installApp(currency) {
    await this.page.click(`#appActionsInstall-${currency}`);
  }

  async uninstallApp(currency) {
    await this.page.click(`#appActionsUninstall-${currency}`);
  }
}
