import Page from "./page";

export default class WCConnectedPage extends Page {
  async disconnectButton() {
    return this.$("#wc-disconnect");
  }

  async iconCheck() {
    return this.$("#wc-icon-check");
  }

  async waitForConnected() {
    const elem = await this.iconCheck();
    await elem.waitForDisplayed();
  }

  async disconnect() {
    const elem = await this.disconnectButton();
    await elem.click();
  }
}
