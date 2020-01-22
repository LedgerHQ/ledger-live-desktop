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
    return this.app.client.element("button*=started");
  }

  /** methods **/

  setAppearance(mode) {
    switch (mode) {
      case "dark":
        this.darkButton.click();
        break;
      case "dusk":
        this.duskButton.click();
        break;
      case "light":
        this.lightButton.click();
        break;
      default:
        this.lightButton.click();
        break;
    }
  }

  getStarted() {
    this.getStartedButton.click();
  }
}
