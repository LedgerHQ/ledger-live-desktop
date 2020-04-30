import Page from "./page";

export default class SettingsPage extends Page {
  get settingsContainer() {
    return this.app.client.element("#settings-container");
  }

  get experimentalTabButton() {
    return this.app.client.element("#settings-experimental-tab");
  }

  get generalTitle() {
    return this.app.client.element("#settings-general-title");
  }

  get generalDescription() {
    return this.app.client.element("#setting-general-desc");
  }

  get experimentalTitle() {
    return this.app.client.element("#settings-experimental_features-title");
  }

  get experimentalDescription() {
    return this.app.client.element("#setting-experimental_features-desc");
  }

  get developerModeButton() {
    return this.app.client.element("#MANAGER_DEV_MODE_button");
  }

  async isVisible(reverse = false) {
    const visible = reverse
      ? await !this.app.client.waitForVisible("#settings-container", 3000, reverse)
      : await this.app.client.waitForVisible("#settings-container");

    return visible;
  }

  goToSettings() {
    return this.topbarSettingsButton.click().then(this.app.client.waitUntilWindowLoaded());
  }

  goToSettingsExperimental() {
    return this.experimentalTabButton.click().then(this.app.client.waitUntilWindowLoaded());
  }

  enableDevMode() {
    return this.developerModeButton.click().then(this.app.client.waitUntilWindowLoaded());
  }
}
