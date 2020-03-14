export default class Page {
  constructor(app) {
    this.app = app;
  }

  get loadingLogo() {
    return this.app.client.element("#loading-logo");
  }

  get logo() {
    return this.app.client.element("#logo");
  }

  get pageTitle() {
    return this.app.client.element("#page-title");
  }

  get pageDescription() {
    return this.app.client.element("#page-description");
  }

  get theme() {
    return this.app.client.element("#main-container");
  }

  async getThemeColor() {
    const bgColor = await this.theme.getCssProperty("background-color");
    return bgColor.parsed.hex;
  }

  isVisible() {
    return this.app.client.waitForVisible("#main-container");
  }
}
