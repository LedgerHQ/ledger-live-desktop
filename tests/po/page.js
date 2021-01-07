export default class Page {
  constructor(app) {
    this.app = app;
  }

  get loadingLogo() {
    return this.app.client.$("#loading-logo");
  }

  get logo() {
    return this.app.client.$("#logo");
  }

  get pageTitle() {
    return this.app.client.$("#page-title");
  }

  get pageDescription() {
    return this.app.client.$("#page-description");
  }

  get theme() {
    return this.app.client.$("#onboarding-container");
  }

  get inputError() {
    return this.app.client.$("#input-error");
  }

  get inputWarning() {
    return this.app.client.$("#input-warning");
  }

  get drawerCollapseButton() {
    return this.app.client.$("#drawer-collapse-button");
  }

  get drawerPortfolioButton() {
    return this.app.client.$("#drawer-dashboard-button");
  }

  get drawerAccountsButton() {
    return this.app.client.$("#drawer-accounts-button");
  }

  get drawerSendButton() {
    return this.app.client.$("#drawer-send-button");
  }

  get drawerReceiveButton() {
    return this.app.client.$("#drawer-receive-button");
  }

  get drawerManagerButton() {
    return this.app.client.$("#drawer-manager-button");
  }

  get drawerBuycryptoButton() {
    return this.app.client.$("#drawer-exchange-button");
  }

  get topbarDiscreetButton() {
    return this.app.client.$("#topbar-discreet-button");
  }

  get topbarSettingsButton() {
    return this.app.client.$("#topbar-settings-button");
  }

  get topbarLockButton() {
    return this.app.client.$("#topbar-password-lock-button");
  }

  async getThemeColor() {
    const bgColor = await this.theme.getCSSProperty("background-color");
    return bgColor.parsed.hex;
  }
}
