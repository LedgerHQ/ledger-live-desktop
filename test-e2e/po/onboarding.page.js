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
    return this.app.client.element('[data-automation-id="onboarding-get-started-button"]');
  }

  get newDeviceButton() {
    return this.app.client.element('[data-automation-id="onboarding-newdevice-button"]');
  }

  get restoreDeviceButton() {
    return this.app.client.element('[data-automation-id="onboarding-restoredevice-button"]');
  }

  get initializedDeviceButton() {
    return this.app.client.element('[data-automation-id="onboarding-initializeddevice-button"]');
  }

  get noDeviceButton() {
    return this.app.client.element('[data-automation-id="onboarding-nodevice-button"]');
  }

  get nanoX() {
    return this.app.client.element('[data-automation-id="onboarding-select-nanox"]');
  }

  get nanoS() {
    return this.app.client.element('[data-automation-id="onboarding-select-nanos"]');
  }

  get blue() {
    return this.app.client.element('[data-automation-id="onboarding-select-blue"]');
  }

  get genuineCheckPinRatio() {
    return '[data-automation-id="onboarding-genuine-pin-ratio"]';
  }

  get genuineCheckSeedRatio() {
    return '[data-automation-id="onboarding-genuine-seed-ratio"]';
  }

  get genuineCheckButton() {
    return this.app.client.element('[data-automation-id="onboarding-genuine-check"]');
  }

  get continueButton() {
    return this.app.client.element('[data-automation-id="onboarding-continue-button"]');
  }

  get backButton() {
    return this.app.client.element('[data-automation-id="onboarding-back-button"]');
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
        await this.nanos.click();
        break;
      case "blue":
        await this.blue.click();
        break;
    }
  }

  async genuineCheckPin(answer) {
    switch (answer) {
      case "yes":
        await this.app.client.element(`${this.genuineCheckPinRatio} > :nth-child(1)`).click();
        break;
      case "no":
        await this.app.client.element(`${this.genuineCheckPinRatio} > :nth-child(2)`).click();
        break;
    }
  }

  async genuineCheckSeed(answer) {
    switch (answer) {
      case "yes":
        await this.app.client.element(`${this.genuineCheckSeedRatio} > :nth-child(1)`).click();
        break;
      case "no":
        await this.app.client.element(`${this.genuineCheckSeedRatio} > :nth-child(2)`).click();
        break;
    }
  }

  async genuineCheck() {
    await this.genuineCheckButton.click();
  }

  async continue() {
    await this.continueButton.click();
  }

  async back() {
    await this.backButton.click();
  }
}
