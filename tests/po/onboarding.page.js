import Page from "./page";

export default class OnboardingPage extends Page {
  /**  elements **/

  get darkButton() {
    return this.app.client.element("#dark");
  }

  get duskButton() {
    return this.app.client.element("#dusk");
  }

  get lightButton() {
    return this.app.client.element("#light");
  }

  get getStartedButton() {
    return this.app.client.element("#onboarding-get-started-button");
  }

  get newDeviceButton() {
    return this.app.client.element("#onboarding-newdevice-button");
  }

  get restoreDeviceButton() {
    return this.app.client.element("#onboarding-restoredevice-button");
  }

  get initializedDeviceButton() {
    return this.app.client.element("#onboarding-initializeddevice-button");
  }

  get noDeviceButton() {
    return this.app.client.element("#onboarding-nodevice-button");
  }

  get buyNewButton() {
    return this.app.client.element("#onboarding-buynew-button");
  }

  get learnMoreButton() {
    return this.app.client.element("#onboarding-learnmore-button");
  }

  get nanoX() {
    return this.app.client.element("#onboarding-select-nanox");
  }

  get nanoS() {
    return this.app.client.element("#onboarding-select-nanos");
  }

  get blue() {
    return this.app.client.element("#onboarding-select-blue");
  }

  get continueButton() {
    return this.app.client.element("#onboarding-continue-button");
  }

  get skipButton() {
    return this.app.client.element("#onboarding-skip-button");
  }

  get backButton() {
    return this.app.client.element("#onboarding-back-button");
  }

  get contactUsButton() {
    return this.app.client.element("#onboarding-contactus-button");
  }

  get openButton() {
    return this.app.client.element("#onboarding-open-button");
  }

  get twitterButton() {
    return this.app.client.element("#onboarding-twitter-button");
  }

  get githubButton() {
    return this.app.client.element("#onboarding-github-button");
  }

  get redditButton() {
    return this.app.client.element("#onboarding-reddit-button");
  }

  /** methods **/

  async setTheme(theme) {
    switch (theme) {
      case "dark":
        await this.darkButton.click();
        break;
      case "dusk":
        await this.duskButton.click();
        break;
      case "light":
        await this.lightButton.click();
        break;
    }

    await this.app.client.pause(600);
  }

  async getStarted() {
    await this.getStartedButton.click();
  }

  async selectConfiguration(menu) {
    switch (menu) {
      case "new":
        await this.newDeviceButton.click();
        break;
      case "restore":
        await this.restoreDeviceButton.click();
        break;
      case "initialized":
        await this.initializedDeviceButton.click();
        break;
      case "nodevice":
        await this.noDeviceButton.click();
        break;
    }
  }

  async selectDevice(device) {
    switch (device) {
      case "nanox":
        await this.nanoX.click();
        break;
      case "nanos":
        await this.nanoS.click();
        break;
      case "blue":
        await this.blue.click();
        break;
    }
  }

  continue() {
    return this.continueButton.click().then(this.app.client.waitUntilWindowLoaded());
  }

  back() {
    return this.backButton.click().then(this.app.client.waitUntilWindowLoaded());
  }

  open() {
    return this.openButton.click().then(this.app.client.waitUntilWindowLoaded());
  }

  isVisible() {
    return this.app.client.waitForVisible("#onboarding-container");
  }
}
