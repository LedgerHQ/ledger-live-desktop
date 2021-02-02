import Page from "./page";

export default class ModalPage extends Page {
  get container() {
    return this.$("#modal-container");
  }

  get content() {
    return this.$("#modal-content");
  }

  get title() {
    return this.$("#modal-title");
  }

  get termsCheckbox() {
    return this.$("#modal-terms-checkbox");
  }

  get confirmButton() {
    return this.$("#modal-confirm-button");
  }

  get continueButton() {
    return this.$("#modal-continue-button");
  }

  get saveButton() {
    return this.$("#modal-save-button");
  }

  get cancelButton() {
    return this.$("#modal-cancel-button");
  }

  get closeButton() {
    return this.$("#modal-close-button");
  }

  // Add Account Modal

  get importAddButton() {
    return this.$("#add-accounts-import-add-button");
  }

  async addAccountFlow(currency, mockDeviceEvent) {
    const container = await this.container;
    const selectControl = await container.$(".select__control");
    await selectControl.click();

    const input = await selectControl.$("input");
    await input.addValue(currency);
    const firstOption = await this.$(".select-options-list .option:first-child");
    await firstOption.click();

    const continueBtn = await this.continueButton;
    await continueBtn.click();

    await mockDeviceEvent({ type: "opened" });
    const importBtn = await this.importAddButton;
    await importBtn.waitForDisplayed();
    await importBtn.waitForEnabled();
    await importBtn.click();
  }

  // Account Settings Modal

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

  // Export Operations History Modal
  get accountList() {
    return this.$("#accounts-list-selectable");
  }

  async getAccountsRows() {
    const list = await this.accountList;
    return list.$$(".account-row");
  }

  async isDisplayed(reverse = false) {
    const elem = await this.$("#modal-container");
    const visible = reverse
      ? await !elem.waitForDisplayed({ timeout: 3000, reverse })
      : await elem.waitForDisplayed();

    return visible;
  }

  async close() {
    const elem = await this.closeButton;
    return elem.click();
  }

  async confirm() {
    const elem = await this.confirmButton;
    return elem.click();
  }
}
