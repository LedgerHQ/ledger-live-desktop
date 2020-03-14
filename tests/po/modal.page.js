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

  get continueButton() {
    return this.app.client.element("#modal-continue-button");
  }

  get closeButton() {
    return this.app.client.element("#modal-close-button");
  }

  isVisible() {
    return this.app.client.waitForVisible("#modal-container");
  }
}
