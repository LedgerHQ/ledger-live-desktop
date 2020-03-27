import Page from "./page";

export default class PortfolioPage extends Page {
  get portfolioContainer() {
    return this.app.client.element("#portfolio-container");
  }

  isVisible() {
    return this.app.client.waitForVisible("#portfolio-container");
  }
}
