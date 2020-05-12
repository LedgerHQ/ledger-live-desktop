import Page from "./page";

export default class PasswordPage extends Page {
  get newPasswordInput() {
    return this.app.client.element("#newPassword");
  }

  get confirmPasswordInput() {
    return this.app.client.element("#confirmPassword");
  }

  get continueButton() {
    return this.app.client.element("#onboarding-password-continue-button");
  }

  get skipButton() {
    return this.app.client.element("#onboarding-password-skip-button");
  }

  continue() {
    return this.continueButton.click().then(this.app.client.waitUntilWindowLoaded());
  }

  skip() {
    return this.skipButton.click().then(this.app.client.waitUntilWindowLoaded());
  }
}
