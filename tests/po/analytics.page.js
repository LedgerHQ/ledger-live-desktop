import Page from "./page";

export default class AnalyticsPage extends Page {
  get dataContainer() {
    return "#onboarding-analytics-data";
  }

  get dataTitle() {
    return this.app.client.$(`${this.dataContainer} .analytics-title`);
  }

  get dataText() {
    return this.app.client.$(`${this.dataContainer} .analytics-text`);
  }

  get dataFakeLink() {
    return this.app.client.$(`${this.dataContainer} .fake-link`);
  }

  get dataSwitch() {
    return this.app.client.$(`${this.dataContainer} .switch`);
  }

  get dataSwitchInput() {
    return this.app.client.$(`${this.dataContainer} .switch > input`);
  }

  get shareContainer() {
    return "#onboarding-analytics-share";
  }

  get shareTitle() {
    return this.app.client.$(`${this.shareContainer} .analytics-title`);
  }

  get shareText() {
    return this.app.client.$(`${this.shareContainer} .analytics-text`);
  }

  get shareFakeLink() {
    return this.app.client.$(`${this.shareContainer} .fake-link`);
  }

  get shareSwitch() {
    return this.app.client.$(`${this.shareContainer} .switch`);
  }

  get shareSwitchInput() {
    return this.app.client.$(`${this.shareContainer} .switch > input`);
  }

  get logsContainer() {
    return "#onboarding-analytics-logs";
  }

  get logsTitle() {
    return this.app.client.$(`${this.logsContainer} .analytics-title`);
  }

  get logsText() {
    return this.app.client.$(`${this.logsContainer} .analytics-text`);
  }

  get logsFakelink() {
    return this.app.client.$(`${this.logsContainer} .fake-link`);
  }

  get logsSwitch() {
    return this.app.client.$(`${this.logsContainer} .switch`);
  }

  get logsSwitchInput() {
    return this.app.client.$(`${this.logsContainer} .switch > input`);
  }

  async isDisplayed() {
    const elem = await this.app.client.$("#onboarding-analytics-data");
    return elem.waitForDisplayed();
  }
}
