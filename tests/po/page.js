export default class Page {
  constructor(app) {
    this.app = app;
    this.$ = selector => app.client.$(selector);
  }

  get loadingLogo() {
    return this.$("#loading-logo");
  }

  get logo() {
    return this.$("#logo");
  }

  get pageTitle() {
    return this.$("#page-title");
  }

  get pageDescription() {
    return this.$("#page-description");
  }

  get theme() {
    return this.$("#onboarding-container");
  }

  get inputError() {
    return this.$("#input-error");
  }

  get inputWarning() {
    return this.$("#input-warning");
  }

  get drawerCollapseButton() {
    return this.$("#drawer-collapse-button");
  }

  get drawerPortfolioButton() {
    return this.$("#drawer-dashboard-button");
  }

  get drawerAccountsButton() {
    return this.$("#drawer-accounts-button");
  }

  get drawerSendButton() {
    return this.$("#drawer-send-button");
  }

  get drawerReceiveButton() {
    return this.$("#drawer-receive-button");
  }

  get drawerManagerButton() {
    return this.$("#drawer-manager-button");
  }

  get drawerBuycryptoButton() {
    return this.$("#drawer-exchange-button");
  }

  get drawerExperimentalButton() {
    return this.$("#drawer-experimental-button");
  }

  get topbarDiscreetButton() {
    return this.$("#topbar-discreet-button");
  }

  get topbarSettingsButton() {
    return this.$("#topbar-settings-button");
  }

  get topbarLockButton() {
    return this.$("#topbar-password-lock-button");
  }

  get bookmarkedAccountsList() {
    return this.$("#bookmarked-accounts");
  }

  async getBookmarkedAccounts() {
    const list = await this.bookmarkedAccountsList;
    const items = await list.$$(".bookmarked-account-item");
    return items;
  }

  // Drawer Menu
  async goToAccounts() {
    const btn = await this.drawerAccountsButton;
    await btn.click();
  }

  async goToPortfolio() {
    const btn = await this.drawerPortfolioButton;
    await btn.click();
  }

  async getThemeColor() {
    const bgColor = await this.theme.getCSSProperty("background-color");
    return bgColor.parsed.hex;
  }
}
