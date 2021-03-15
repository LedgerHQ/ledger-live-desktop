import Page from "./page";
import { modalPage } from "../common.js";

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

  async passwordLockSwitch() {
    return this.$("#settings-password-lock-switch");
  }

  async passwordChangeButton() {
    return this.$("#settings-password-change-button");
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

  async togglePasswordLock() {
    await this.goToSettings();
    const passwordBtn = await this.passwordLockSwitch();
    await passwordBtn.click();
  }

  async setNewPassword(password) {
    const newInput = await modalPage.newPasswordInput();
    await newInput.click();
    await newInput.setValue(password);
  }

  async confirmPassword(password) {
    const confirmInput = await modalPage.confirmPasswordInput();
    await confirmInput.click();
    await confirmInput.setValue(password);
  }

  async enablePasswordLock(password, confirmPassword) {
    await this.setNewPassword(password);
    await this.confirmPassword(confirmPassword);
    const saveBtn = await modalPage.saveButton();
    await saveBtn.waitForEnabled();
    await saveBtn.click();
  }

  async openChangePasswordModal() {
    const changePassBtn = await this.passwordChangeButton();
    await changePassBtn.click();
  }

  async writeCurrentPassword(password) {
    const currentPassInput = await modalPage.currentPasswordInput();
    await currentPassInput.click();
    await currentPassInput.setValue(password);
  }

  async disablePassword(password) {
    const currentPassInput = await modalPage.disablePasswordInput();
    await currentPassInput.click();
    await currentPassInput.setValue(password);
    const saveBtn = await modalPage.saveButton();
    await saveBtn.waitForEnabled();
    await saveBtn.click();
  }
}
