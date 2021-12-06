import { Page, Locator } from "@playwright/test";

export class ManagerPage {
  readonly page: Page;
  readonly managerMenu: Locator;
  readonly installedAppsTab: Locator;
  readonly catalogAppsTab: Locator;
  readonly updateAllButton: Locator;
  readonly appUpdateState: Locator;
  readonly installAppButton: Function;
  readonly uninstallAppButton: Function;
  readonly uninstallAllAppsButton: Locator;
  readonly confirmButton: Locator;
  readonly installedAppEmptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.managerMenu = page.locator('#drawer-manager-button');
    this.installedAppsTab = page.locator('#appsOnDevice-tab');
    this.catalogAppsTab = page.locator('#appCatalog-tab');
    this.updateAllButton = page.locator('#managerAppsList-updateAll');
    this.appUpdateState = page.locator('text=Updating...');
    this.installAppButton = (currency: string) : Locator => page.locator(`#appActionsInstall-${currency}`);
    this.uninstallAppButton = (currency: string) : Locator => page.locator(`#appActionsUninstall-${currency}`);
    this.uninstallAllAppsButton = page.locator('button:has-text("Uninstall all")');
    this.confirmButton = page.locator("#modal-confirm-button");
    this.installedAppEmptyState = page.locator("text=No apps installed on your device");
  }

  async navigate() {
    await this.managerMenu.click();
  }

  async goToInstalledAppTab() {
    await this.installedAppsTab.click();
  }

  async goToCatalogTab() {
    await this.catalogAppsTab.click();
  }

  async updateAllApps() {
    await this.updateAllButton.click();
    await this.appUpdateState.waitFor({ state: "detached" });
  }

  async installApp(currency: string) {
    await this.installAppButton(currency).click();
  }

  async uninstallApp(currency: string) {
    await this.uninstallAppButton(currency).click();
  }

  async uninstallAllApps() {
    await this.uninstallAllAppsButton.click();
    await this.confirmButton.click();
    await this.installedAppEmptyState.waitFor({ state: "visible" });
  }
}
