import Page from "./page";

export default class SettingsPage extends Page {
  async accountsTab() {
    return this.$("#settings-accounts-tab");
  }

  async aboutTab() {
    return this.$("#settings-about-tab");
  }

  async helpTab() {
    return this.$("#settings-help-tab");
  }

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

  async goToAccountsTab() {
    const accountsTab = await this.accountsTab();
    await accountsTab.click();
  }

  async goToAboutTab() {
    const aboutTab = await this.aboutTab();
    await aboutTab.click();
  }

  async goToHelpTab() {
    const helpTab = await this.helpTab();
    await helpTab.click();
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
