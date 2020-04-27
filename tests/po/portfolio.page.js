import Page from "./page";

export default class PortfolioPage extends Page {
  get portfolioContainer() {
    return this.app.client.element("#portfolio-container");
  }

  async isVisible(reverse = false) {
    const visible = reverse
      ? await !this.app.client.waitForVisible("#portfolio-container", 3000, reverse)
      : await this.app.client.waitForVisible("#portfolio-container");

    return visible;
  }
}
