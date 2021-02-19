import Page from "./page";

export default class AccountPage extends Page {
  async appOnDeviceTab() {
    return this.$("#appsOnDevice-tab");
  }

  async appCatalogTab() {
    return this.$("#appCatalog-tab");
  }

  async updateAllButton() {
    return this.$("#managerAppsList-updateAll");
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
}
