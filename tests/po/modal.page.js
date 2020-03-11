import Page from "./page";

export default class ModalPage extends Page {
  get container() {
    return this.app.client.element('[data-automation-id="modal-container"]');
  }

  get content() {
    return this.app.client.element('[data-automation-id="modal-content"]');
  }

  get title() {
    return this.app.client.element('[data-automation-id="modal-title"]');
  }

  get continueButton() {
    return this.app.client.element('[data-automation-id="modal-continue-button"]');
  }

  get closeButton() {
    return this.app.client.element('[data-automation-id="modal-close-button"]');
  }

  visible() {
    return this.app.client.waitForVisible('[data-automation-id="modal-container"]');
  }

  getTitle() {
    return this.title.getText();
  }
}
