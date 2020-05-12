import Page from "./page";

export default class GenuinePage extends Page {
  get checkPinRatio() {
    return "#onboarding-genuine-pin";
  }

  get checkSeedRatio() {
    return "#onboarding-genuine-seed";
  }

  get checkButton() {
    return this.app.client.element("#onboarding-genuine-button");
  }

  get checkLabel() {
    return this.app.client.element("#onboarding-genuine-label");
  }

  async checkPin(answer) {
    answer
      ? await this.app.client.element(`${this.checkPinRatio} > :nth-child(1)`).click()
      : await this.app.client.element(`${this.checkPinRatio} > :nth-child(2)`).click();
  }

  async checkSeed(answer) {
    answer
      ? await this.app.client.element(`${this.checkSeedRatio} > :nth-child(1)`).click()
      : await this.app.client.element(`${this.checkSeedRatio} > :nth-child(2)`).click();
  }

  async check() {
    await this.checkButton.click();
  }
}
