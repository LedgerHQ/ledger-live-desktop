import { Page } from '@playwright/test';

export class OnboardingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getStarted() {
    await this.page.click('#onboarding-get-started-button');
  }

  async acceptTerms() {
    await this.page.click("#onboarding-terms-check");
    await Promise.all([
      this.page.waitForResponse(/\.svg$/),
      this.page.click('#onboarding-terms-submit'),
    ]);
  }

  async selectDevice(device) {
    await this.page.click(`button:has-text("${device}")`)
  }

  async connectDevice() {
    await this.page.click(
      'button:has-text("Connect deviceConnect your Nano XIs your device already set up? Connect it to th")',
      );
    await this.page.waitForSelector('#modal-container', { state: 'visible' });
  }

  async checkDevice() {
    await this.page.click('button:has-text("Check my Nano")');
  }

  async continue() {
    await this.page.click('button:has-text("Continue")')
  }
};
