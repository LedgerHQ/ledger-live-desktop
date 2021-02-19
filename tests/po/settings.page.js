import Page from "./page";

export default class SettingsPage extends Page {
  get experimentalTab() {
    return this.$("#settings-experimental-tab");
  }

  get experimentalDevModeButton() {
    return this.$("#MANAGER_DEV_MODE_button");
  }

  async goToSettings() {
    const settingsBtn = await this.topbarSettingsButton;
    await settingsBtn.click();
  }

  async goToExperimentalTab() {
    const experimentalTab = await this.experimentalTab;
    await experimentalTab.click();
  }

  async toggleDevModeButton() {
    const devModeBtn = await this.experimentalDevModeButton;
    await devModeBtn.click();
  }
}
