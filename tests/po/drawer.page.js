import Page from "./page";

export default class ModalPage extends Page {
  async container() {
    return this.$(".sidedrawer");
  }

  async closeButton() {
    return this.$(".sidedrawer-close");
  }

  async waitForDisplayed() {
    const elem = await this.container();
    const visible = await elem.waitForDisplayed();

    return visible;
  }

  async waitForClosed() {
    const elem = await this.container();
    const closed = elem.waitForDisplayed({ timeout: 3000, reverse: true });
    return closed;
  }

  async close() {
    const elem = await this.closeButton();
    return elem.click();
  }
}
