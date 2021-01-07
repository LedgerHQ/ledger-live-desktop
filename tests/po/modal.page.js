import Page from "./page";

export default class ModalPage extends Page {
  get container() {
    return this.app.client.$("#modal-container");
  }

  get content() {
    return this.app.client.$("#modal-content");
  }

  get title() {
    return this.app.client.$("#modal-title");
  }

  get termsCheckbox() {
    return this.app.client.$("#modal-terms-checkbox");
  }

  get confirmButton() {
    return this.app.client.$("#modal-confirm-button");
  }

  get continueButton() {
    return this.app.client.$("#modal-continue-button");
  }

  get saveButton() {
    return this.app.client.$("#modal-save-button");
  }

  get cancelButton() {
    return this.app.client.$("#modal-cancel-button");
  }

  get closeButton() {
    return this.app.client.$("#modal-close-button");
  }

  async isDisplayed(reverse = false) {
    const elem = await this.app.client.$("#modal-container");
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
