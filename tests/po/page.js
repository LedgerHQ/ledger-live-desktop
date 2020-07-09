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
    return this.app.client.element("#onboarding-container");
  }

  get inputError() {
    return this.app.client.element("#input-error");
  }

  get inputWarning() {
    return this.app.client.element("#input-warning");
  }

  get drawerCollapseButton() {
    return this.app.client.element("#drawer-collapse-button");
  }

  get drawerPortfolioButton() {
    return this.app.client.element("#drawer-dashboard-button");
  }

  get drawerAccountsButton() {
    return this.app.client.element("#drawer-accounts-button");
  }

  get drawerSendButton() {
    return this.app.client.element("#drawer-send-button");
  }

  get drawerReceiveButton() {
    return this.app.client.element("#drawer-receive-button");
  }

  get drawerManagerButton() {
    return this.app.client.element("#drawer-manager-button");
  }

  get drawerBuycryptoButton() {
    return this.app.client.element("#drawer-exchange-button");
  }

  get drawerExperimental() {
    return this.app.client.element("#drawer-experimental-button");
  }

  get topbarDiscreetButton() {
    return this.app.client.element("#topbar-discreet-button");
  }

  get topbarSettingsButton() {
    return this.app.client.element("#topbar-settings-button");
  }

  get topbarLockButton() {
    return this.app.client.element("#topbar-password-lock-button");
  }

  async getThemeColor() {
    const bgColor = await this.theme.getCssProperty("background-color");
    return bgColor.parsed.hex;
  }
}
