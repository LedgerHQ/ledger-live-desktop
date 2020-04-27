import Page from "./page";

export default class LockscreenPage extends Page {
  get passwordInput() {
    return this.app.client.element("#lockscreen-password-input");
  }

  get passwordInputWarning() {
    return this.app.client.element("#input-error");
  }

  get revealButton() {
    return this.app.client.element("#lockscreen-reveal-button");
  }

  get loginButton() {
    return this.app.client.element("#lockscreen-login-button");
  }

  get forgottenButton() {
    return this.app.client.element("#lockscreen-forgotten-button");
  }

  async isVisible(reverse = false) {
    const visible = reverse
      ? await !this.app.client.waitForVisible("#lockscreen-container", 3000, reverse)
      : await this.app.client.waitForVisible("#lockscreen-container");

    return visible;
  }
}
