import Page from "./page";

export default class PasswordPage extends Page {
  get newPasswordInput() {
    return this.app.client.$("#newPassword");
  }

  get confirmPasswordInput() {
    return this.app.client.$("#confirmPassword");
  }

  get continueButton() {
    return this.app.client.$("#onboarding-password-continue-button");
  }

  get skipButton() {
    return this.app.client.$("#onboarding-password-skip-button");
  }

  async continue() {
    const elem = await this.continueButton;
    return elem.click().then(this.app.client.waitUntilWindowLoaded());
  }

  async skip() {
    const elem = await this.skipButton;
    return elem.click().then(this.app.client.waitUntilWindowLoaded());
  }
}
