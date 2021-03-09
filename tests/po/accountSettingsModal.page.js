import Modal from "./modal.page";

export default class AccountSettingsModal extends Modal {
  async settingsDeleteButton() {
    return this.$("#account-settings-delete");
  }

  async settingsApplyButton() {
    return this.$("#account-settings-apply");
  }

  async editNameInput() {
    return this.$("#input-edit-name");
  }

  async editAccountName(newName) {
    const input = await this.editNameInput();
    await input.waitForDisplayed();
    await input.addValue(newName);
    await this.apply();
  }

  async apply() {
    const btn = await this.settingsApplyButton();
    await btn.click();
  }
}
