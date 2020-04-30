import Page from "./page";

export default class AccountsPage extends Page {
  get accountsContainer() {
    return this.app.client.element("#accounts-container");
  }

  get accountsPageTitle() {
    return this.app.client.element("#accounts-title");
  }

  get addAccountButton() {
    return this.app.client.element("#accounts-add-account-button");
  }

  get account() {
    return this.app.client.element(".accounts-account-row-item");
  }

  async isVisible(reverse = false) {
    const visible = reverse
      ? await !this.app.client.waitForVisible("#accounts-container", 3000, reverse)
      : await this.app.client.waitForVisible("#accounts-container");

    return visible;
  }

  goToAccounts() {
    return this.drawerAccountsButton.click().then(this.app.client.waitUntilWindowLoaded());
  }

  addAccounts() {
    return this.addAccountButton.click().then(this.app.client.waitUntilWindowLoaded());
  }
}
