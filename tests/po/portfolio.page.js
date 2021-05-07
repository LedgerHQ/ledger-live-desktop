import Page from "./page";

export default class PortfolioPage extends Page {
  async emtpyStateAddAccountButton() {
    return this.$("#accounts-empty-state-add-account-button");
  }

  async portfolioEmptyStateTitle() {
    return this.$("#portfolio-empty-state-title");
  }

  async carousel() {
    return this.$("#carousel");
  }

  async carouselDismissButton() {
    return this.$("#carousel-dismiss");
  }

  async carouselDismissConfirmButton() {
    return this.$("#carousel-dismiss-confirm");
  }

  async helpButton() {
    return this.$("#topbar-help-button");
  }

  async isAddAccountAvailable() {
    const elem = await this.emtpyStateAddAccountButton();
    return elem.isExisting();
  }

  async announcementsToast() {
    return this.$("#announcements-container");
  }

  async newAnnouncement() {
    return this.$("#new-announcement");
  }
}
