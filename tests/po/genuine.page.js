import Page from "./page";

export default class GenuinePage extends Page {
  get checkPinRatio() {
    return "#onboarding-genuine-pin";
  }

  get checkSeedRatio() {
    return "#onboarding-genuine-seed";
  }

  get checkButton() {
    return this.app.client.$("#onboarding-genuine-button");
  }

  get checkLabel() {
    return this.app.client.$("#onboarding-genuine-label");
  }

  async checkPin(answer) {
    const elem = await this.app.client.$(
      answer ? `${this.checkPinRatio} > :nth-child(1)` : `${this.checkPinRatio} > :nth-child(2)`,
    );

    return elem.click();
  }

  async checkSeed(answer) {
    const elem = await this.app.client.$(
      answer ? `${this.checkSeedRatio} > :nth-child(1)` : `${this.checkSeedRatio} > :nth-child(2)`,
    );

    return elem.click();
  }

  async check() {
    const elem = await this.checkButton;
    return elem.click();
  }
}
