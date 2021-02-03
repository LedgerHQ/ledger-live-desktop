import Modal from "./modal.page";

export default class AccountSettingsModal extends Modal {
  get settingsDeleteButton() {
    return this.$("#account-settings-delete");
  }

  get settingsApplyButton() {
    return this.$("#account-settings-apply");
  }

  get editNameInput() {
    return this.$("#input-edit-name");
  }

  async editAccountName(newName) {
    const input = await this.editNameInput;
    await input.waitForDisplayed();
    await input.addValue(newName);
    await this.apply();
  }

  async apply() {
    const btn = await this.settingsApplyButton;
    await btn.click();
  }
}
