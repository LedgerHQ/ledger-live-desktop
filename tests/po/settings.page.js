import Page from "./page";

export default class SettingsPage extends Page {
  async experimentalTab() {
    return this.$("#settings-experimental-tab");
  }

  async experimentalDevModeButton() {
    return this.$("#MANAGER_DEV_MODE_button");
  }

  async goToSettings() {
    const settingsBtn = await this.topbarSettingsButton();
    await settingsBtn.click();
  }

  async goToExperimentalTab() {
    const experimentalTab = await this.experimentalTab();
    await experimentalTab.click();
  }

  async toggleDevMode() {
    await this.goToSettings();
    await this.goToExperimentalTab();
    const devModeBtn = await this.experimentalDevModeButton();
    await devModeBtn.click();
  }
}
