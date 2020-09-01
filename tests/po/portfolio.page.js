import Page from "./page";

export default class PortfolioPage extends Page {
  get portfolioContainer() {
    return this.app.client.$("#portfolio-container");
  }

  async isDisplayed(reverse = false) {
    const elem = await this.app.client.$("#portfolio-container");
    const visible = reverse
      ? await !elem.waitForDisplayed({ timeout: 3000, reverse })
      : await elem.waitForDisplayed();

    return visible;
  }
}
