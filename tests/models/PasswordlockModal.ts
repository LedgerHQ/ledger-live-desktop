import { Page, Locator, expect } from "@playwright/test";
import { Modal } from "./Modal";

export class PasswordlockModal extends Modal {
  readonly page: Page;
  readonly switchButton: Locator;
  readonly changeButton: Locator;
  readonly newPasswordInput: Locator;
  readonly currentPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly disablePasswordInput: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.switchButton = page.locator("data-test-id=settings-password-lock-switch");
    this.changeButton = page.locator("data-test-id=settings-password-change-button");
    this.newPasswordInput = page.locator('data-test-id=new-password-input');
    this.confirmPasswordInput = page.locator('data-test-id=confirm-password-input');
    this.currentPasswordInput = page.locator('data-test-id=current-password-input');
    this.disablePasswordInput = page.locator('data-test-id=disable-password-input');
  }

  async toggle() {
    await this.switchButton.click();
  }

  async openChangePasswordModal() {
    await this.changeButton.click();
  }

  async enablePassword(newPassword: string, confirmPassword: string) {
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.saveButton.click();
  }

  async disablePassword(password: string) {
    await this.disablePasswordInput.fill(password);
    await this.saveButton.click();
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.saveButton.click();
  }
}
