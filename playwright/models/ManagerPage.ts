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
    await this.page.waitForSelector('text=Uninstalling...', { state: "hidden" });
  }

  async installApp(currency) {
    await this.page.click(`#appActionsInstall-${currency}`);
  }

  async uninstallApp(currency) {
    await this.page.click(`#appActionsUninstall-${currency}`);
  }

  async uninstallAllApps() {
  // Click button:has-text("Uninstall all")
  await this.page.click('button:has-text("Uninstall all")');
  // Click #modal-confirm-button
  await this.page.click('#modal-confirm-button');
  await this.page.waitForSelector('text=No apps installed on your deviceGo to the App catalog to install apps');
  }
}
