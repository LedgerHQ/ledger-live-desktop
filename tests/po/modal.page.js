import Page from "./page";

export default class ModalPage extends Page {
  get container() {
    return this.app.client.element("#modal-container");
  }

  get content() {
    return this.app.client.element("#modal-content");
  }

  get title() {
    return this.app.client.element("#modal-title");
  }

  get termsCheckbox() {
    return this.app.client.element("#modal-terms-checkbox");
  }

  get selectCurrency() {
    return this.app.client.element("#select-currency");
  }

  get selectCurrencyInput() {
    return this.app.client.element("#select-currency input");
  }

  get currencyBadge() {
    return this.app.client.element("#currency-badge");
  }

  get modalAddAccountsButton() {
    return this.app.client.element("#add-accounts-import-add-button");
  }

  get modalAddAccountFinishCloseButton() {
    return this.app.client.element("#add-accounts-finish-close-button");
  }

  get addAccountsSuccess() {
    return this.app.client.element("#add-account-success");
  }

  get continueButton() {
    return this.app.client.element("#modal-continue-button");
  }

  get confirmButton() {
    return this.app.client.element("#modal-confirm-button");
  }

  get releaseNotesContinueButton() {
    return this.app.client.element("#modal-release-notes-continue-button");
  }

  get saveButton() {
    return this.app.client.element("#modal-save-button");
  }

  get cancelButton() {
    return this.app.client.element("#modal-cancel-button");
  }

  get closeButton() {
    return this.app.client.element("#modal-close-button");
  }

  async isVisible(reverse = false) {
    const visible = reverse
      ? await !this.app.client.waitForVisible("#modal-container", 3000, reverse)
      : await this.app.client.waitForVisible("#modal-container");

    return visible;
  }

  async confirmButtonIsEnabled(reverse = false) {
    const enabled = reverse
      ? await !this.app.client.waitForEnabled("#modal-confirm-button", 3000, reverse)
      : await this.app.client.waitForEnabled("#modal-confirm-button");

    return enabled;
  }

  async addAccountButtonIsEnabled() {
    await this.app.client.waitForExist("#add-accounts-import-add-button", 10000);
    await this.app.client.waitForEnabled("#add-accounts-import-add-button", 10000);
  }

  close() {
    return this.closeButton.click();
  }

  continue() {
    return this.continueButton.click();
  }
}
