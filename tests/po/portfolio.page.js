import Page from "./page";

export default class PortfolioPage extends Page {
  get emtpyStateAddAccountButton() {
    return this.$("#accounts-empty-state-add-account-button");
  }

  async isAddAccountAvailable() {
    const elem = await this.emtpyStateAddAccountButton;
    return elem.isExisting();
  }
}
