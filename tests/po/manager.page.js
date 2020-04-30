import Page from "./page";

export default class AccountsPage extends Page {
  get managerContainer() {
    return this.app.client.element("#manager-container");
  }

  get appsListContainer() {
    return this.app.client.element("#manager-applist-container");
  }

  get managerAppsSearchInput() {
    return this.app.client.element("#manager-applist-container input");
  }

  get managerAppName() {
    return this.app.client.element("#manager-app-name");
  }

  get appInstallButton() {
    return this.app.client.element("#manager-app-install-button");
  }

  get appInstallSuccess() {
    return this.app.client.element("#manager-app-install-success");
  }

  async isVisible(reverse = false) {
    const visible = reverse
      ? await !this.app.client.waitForVisible("#manager-container", 3000, reverse)
      : await this.app.client.waitForVisible("#manager-container");

    return visible;
  }
}
