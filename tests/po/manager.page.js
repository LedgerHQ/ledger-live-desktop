import Page from "./page";

export default class ManagerPage extends Page {
  async appOnDeviceTab() {
    return this.$("#appsOnDevice-tab");
  }

  async appCatalogTab() {
    return this.$("#appCatalog-tab");
  }

  async updateAllButton() {
    return this.$("#managerAppsList-updateAll");
  }

  async installAppButton(currency) {
    return this.$(`#appActionsInstall-${currency}`);
  }

  async uninstallAppButton(currency) {
    return this.$(`#appActionsUninstall-${currency}`);
  }

  async goToInstalledAppTab() {
    const tab = await this.appOnDeviceTab();
    await tab.click();
  }

  async goToCatalogTab() {
    const tab = await this.appCatalogTab();
    await tab.click();
  }

  async updateAllApps() {
    const btn = await this.updateAllButton();
    await btn.click();
  }

  async installApp(currency) {
    const btn = await this.installAppButton(currency);
    await btn.click();
  }

  async uninstallApp(currency) {
    const btn = await this.uninstallAppButton(currency);
    await btn.click();
  }
}
