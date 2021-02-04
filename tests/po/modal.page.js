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

  async waitForDisplayed() {
    const elem = await this.container;
    const visible = await elem.waitForDisplayed();

    return visible;
  }

  async waitForClosed() {
    const elem = await this.container;
    const closed = elem.waitForDisplayed({ timeout: 3000, reverse: true });
    return closed;
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
