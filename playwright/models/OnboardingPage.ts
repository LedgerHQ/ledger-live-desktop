import { Page, Locator } from '@playwright/test';

export class OnboardingPage {
  readonly page: Page;
  readonly getStartedButton: Locator;
  readonly termsCheckbox: Locator;
  readonly termsSubmitButton: Locator;
  readonly selectDeviceButton: Function;
  readonly connectDeviceButton: Locator;
  readonly modalContainer: Locator;
  readonly checkMyNanoButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedButton = page.locator('#onboarding-get-started-button');
    this.termsCheckbox = page.locator("#onboarding-terms-check");
    this.termsSubmitButton = page.locator('#onboarding-terms-submit');
    this.selectDeviceButton = (device: string): Locator => page.locator(`button:has-text("${device}")`);
    this.connectDeviceButton = page.locator('button:has-text("Connect deviceConnect your Nano XIs your device already set up? Connect it to th")');
    this.modalContainer = page.locator('data-test-id=modal-container');
    this.checkMyNanoButton = page.locator('button:has-text("Check my Nano")');
    this.continueButton = page.locator('button:has-text("Continue")')
  }

  async getStarted() {
    await this.getStartedButton.click();
  }

  async acceptTerms() {
    await this.termsCheckbox.click();
    await Promise.all([
      this.page.waitForResponse("**/*.svg"),
      this.termsSubmitButton.click(),
    ]);
  }

  async selectDevice(device: "Nano S" | "Nano X" | "Blue") {
    await this.selectDeviceButton(device).click();
  }

  async connectDevice() {
    await this.connectDeviceButton.click();
    await this.modalContainer.waitFor({ state: 'visible' });
  }

  async checkDevice() {
    await this.checkMyNanoButton.click();
  }

  async continue() {
    await this.continueButton.click()
  }
};
