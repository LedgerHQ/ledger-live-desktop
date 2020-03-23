import Page from "./page";

export default class PasswordPage extends Page {
  get newPasswordInput() {
    return this.app.client.element("#newPassword");
  }

  get confirmPasswordInput() {
    return this.app.client.element("#confirmPassword");
  }
}
