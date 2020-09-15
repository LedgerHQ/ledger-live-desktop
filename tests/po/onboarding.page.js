import Page from "./page";

export default class OnboardingPage extends Page {
  /**  elements **/

  get darkButton() {
    return this.app.client.$("#dark");
  }

  get duskButton() {
    return this.app.client.$("#dusk");
  }

  get lightButton() {
    return this.app.client.$("#light");
  }

  get getStartedButton() {
    return this.app.client.$("#onboarding-get-started-button");
  }

  get newDeviceButton() {
    return this.app.client.$("#onboarding-newdevice-button");
  }

  get restoreDeviceButton() {
    return this.app.client.$("#onboarding-restoredevice-button");
  }

  get initializedDeviceButton() {
    return this.app.client.$("#onboarding-initializeddevice-button");
  }

  get noDeviceButton() {
    return this.app.client.$("#onboarding-nodevice-button");
  }

  get buyNewButton() {
    return this.app.client.$("#onboarding-buynew-button");
  }

  get learnMoreButton() {
    return this.app.client.$("#onboarding-learnmore-button");
  }

  get nanoX() {
    return this.app.client.$("#onboarding-select-nanox");
  }

  get nanoS() {
    return this.app.client.$("#onboarding-select-nanos");
  }

  get blue() {
    return this.app.client.$("#onboarding-select-blue");
  }

  get continueButton() {
    return this.app.client.$("#onboarding-continue-button");
  }

  get skipButton() {
    return this.app.client.$("#onboarding-skip-button");
  }

  get backButton() {
    return this.app.client.$("#onboarding-back-button");
  }

  get contactUsButton() {
    return this.app.client.$("#onboarding-contactus-button");
  }

  get openButton() {
    return this.app.client.$("#onboarding-open-button");
  }

  get twitterButton() {
    return this.app.client.$("#onboarding-twitter-button");
  }

  get githubButton() {
    return this.app.client.$("#onboarding-github-button");
  }

  get redditButton() {
    return this.app.client.$("#onboarding-reddit-button");
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
    const elem = await this.getStartedButton;
    return elem.click();
  }

  async selectConfiguration(menu) {
    let elem;
    switch (menu) {
      case "new":
        elem = await this.newDeviceButton;
        break;
      case "restore":
        elem = await this.restoreDeviceButton;
        break;
      case "initialized":
        elem = await this.initializedDeviceButton;
        break;
      case "nodevice":
        elem = await this.noDeviceButton;
        break;
    }

    return elem.click();
  }

  async selectDevice(device) {
    let elem;
    switch (device) {
      case "nanox":
        elem = await this.nanoX;
        break;
      case "nanos":
        elem = await this.nanoS;
        break;
      case "blue":
        elem = await this.blue;
        break;
    }

    return elem.click();
  }

  async continue() {
    const elem = await this.continueButton;
    return elem.click().then(this.app.client.waitUntilWindowLoaded());
  }

  async back() {
    const elem = await this.backButton;
    return elem.click().then(this.app.client.waitUntilWindowLoaded());
  }

  async open() {
    const elem = await this.openButton;
    return elem.click().then(this.app.client.waitUntilWindowLoaded());
  }

  async isDisplayed() {
    const elem = await this.app.client.$("#onboarding-container");
    return elem.waitForDisplayed();
  }
}
