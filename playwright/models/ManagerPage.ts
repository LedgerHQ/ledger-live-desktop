import { Page, Locator } from "@playwright/test";

export class ManagerPage {
  readonly page: Page;
  readonly managerMenu: Locator;
  readonly firmwareUpdateButton: Locator;
  readonly installedAppsTab: Locator;
  readonly catalogAppsTab: Locator;
  readonly updateAllButton: Locator;
  readonly appUpdateState: Locator;
  readonly appInstallState: Locator;
  readonly installAppButton: Function;
  readonly uninstallAppButton: Function;
  readonly uninstallAllAppsButton: Locator;
  readonly confirmButton: Locator;
  readonly installedAppEmptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.managerMenu = page.locator('data-test-id=drawer-manager-button');
    this.firmwareUpdateButton = page.locator("#manager-update-firmware-button");
    this.installedAppsTab = page.locator('data-test-id=manager-installed-apps-tab');
    this.catalogAppsTab = page.locator('data-test-id=manager-app-catalog-tab');
    this.updateAllButton = page.locator('#managerAppsList-updateAll');
    this.appUpdateState = page.locator('text=Updating...').first();
    this.appInstallState = page.locator('text=Installing...').first();
    this.installAppButton = (currency: string) : Locator => page.locator(`#appActionsInstall-${currency}`);
    this.uninstallAppButton = (currency: string) : Locator => page.locator(`#appActionsUninstall-${currency}`);
    this.uninstallAllAppsButton = page.locator('button:has-text("Uninstall all")');
    this.confirmButton = page.locator('data-test-id=modal-confirm-button');
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
    await this.appInstallState.waitFor({ state: "detached" });
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
