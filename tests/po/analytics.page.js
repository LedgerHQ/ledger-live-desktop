import Page from "./page";

export default class AnalyticsPage extends Page {
  get dataContainer() {
    return "#onboarding-analytics-data";
  }

  get dataTitle() {
    return this.app.client.element(`${this.dataContainer} .analytics-title`);
  }

  get dataText() {
    return this.app.client.element(`${this.dataContainer} .analytics-text`);
  }

  get dataFakeLink() {
    return this.app.client.element(`${this.dataContainer} .fake-link`);
  }

  get dataSwitch() {
    return this.app.client.element(`${this.dataContainer} .switch`);
  }

  get dataSwitchInput() {
    return this.app.client.element(`${this.dataContainer} .switch > input`);
  }

  get shareContainer() {
    return "#onboarding-analytics-share";
  }

  get shareTitle() {
    return this.app.client.element(`${this.shareContainer} .analytics-title`);
  }

  get shareText() {
    return this.app.client.element(`${this.shareContainer} .analytics-text`);
  }

  get shareFakeLink() {
    return this.app.client.element(`${this.shareContainer} .fake-link`);
  }

  get shareSwitch() {
    return this.app.client.element(`${this.shareContainer} .switch`);
  }

  get shareSwitchInput() {
    return this.app.client.element(`${this.shareContainer} .switch > input`);
  }

  get logsContainer() {
    return "#onboarding-analytics-logs";
  }

  get logsTitle() {
    return this.app.client.element(`${this.logsContainer} .analytics-title`);
  }

  get logsText() {
    return this.app.client.element(`${this.logsContainer} .analytics-text`);
  }

  get logsFakelink() {
    return this.app.client.element(`${this.logsContainer} .fake-link`);
  }

  get logsSwitch() {
    return this.app.client.element(`${this.logsContainer} .switch`);
  }

  get logsSwitchInput() {
    return this.app.client.element(`${this.logsContainer} .switch > input`);
  }

  isVisible() {
    return this.app.client.waitForVisible("#onboarding-analytics-data");
  }
}
