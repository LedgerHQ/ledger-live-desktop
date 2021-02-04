import Page from "./page";

export default class PortfolioPage extends Page {
  get emtpyStateAddAccountButton() {
    return this.$("#accounts-empty-state-add-account-button");
  }

  get carousel() {
    return this.$("#carousel");
  }

  get carouselDismissButton() {
    return this.$("#carousel-dismiss");
  }

  get carouselDismissConfirmButton() {
    return this.$("#carousel-dismiss-confirm");
  }

  async isAddAccountAvailable() {
    const elem = await this.emtpyStateAddAccountButton;
    return elem.isExisting();
  }
}
