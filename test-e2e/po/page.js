export default class Page {
  constructor(app) {
    this.app = app;
  }

  get logo() {
    return this.app.client.element('[data-automation-id="logo"]');
  }

  get pageTitle() {
    return this.app.client.element('[data-automation-id="page-title"]');
  }

  get pageDescription() {
    return this.app.client.element('[data-automation-id="page-description"]');
  }

  get theme() {
    return this.app.client.element('[data-automation-id="main-container"]');
  }

  async getThemeColor() {
    const bgColor = await this.theme.getCssProperty("background-color");
    return bgColor.parsed.hex;
  }

  isVisible() {
    return this.app.client.waitForVisible('[data-automation-id="main-container"]');
  }

  getPageTitle() {
    return this.pageTitle.getText();
  }

  getPageDescription() {
    return this.pageDescription.getText();
  }
}
