import Page from "./page";

export default class LockscreenPage extends Page {
  get passwordInput() {
    return this.app.client.$("#lockscreen-password-input");
  }

  get passwordInputWarning() {
    return this.app.client.$("#input-error");
  }

  get revealButton() {
    return this.app.client.$("#lockscreen-reveal-button");
  }

  get loginButton() {
    return this.app.client.$("#lockscreen-login-button");
  }

  get forgottenButton() {
    return this.app.client.$("#lockscreen-forgotten-button");
  }

  async isDisplayed(reverse = false) {
    const elem = await this.app.client.$("#lockscreen-container");
    const visible = reverse
      ? await !elem.waitForDisplayed({ timeout: 3000, reverse })
      : await elem.waitForDisplayed();

    return visible;
  }
}
