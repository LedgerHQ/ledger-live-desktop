import { Page, Locator } from "@playwright/test";

export class Modal {
  readonly page: Page;
  readonly container: Locator;
  readonly title: Locator;
  readonly subtitle: Locator;
  readonly content: Locator;
  readonly backdrop: Locator;
  readonly continueButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly confirmButton: Locator;
  readonly doneButton: Locator;
  readonly closeButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('[data-test-id=modal-container][style="opacity: 1; transform: scale(1);"]');
    this.title = page.locator('data-test-id=modal-title');
    this.subtitle = page.locator('data-test-id=modal-subtitle');
    this.content = page.locator('data-test-id=modal-content');
    this.backdrop = page.locator('data-test-id=modal-backdrop');
    this.continueButton = page.locator('data-test-id=modal-continue-button');
    this.saveButton = page.locator('data-test-id=modal-save-button');
    this.cancelButton = page.locator('data-test-id=modal-cancel-button');
    this.confirmButton = page.locator('data-test-id=modal-confirm-button');
    this.doneButton = page.locator('data-test-id=modal-done-button');
    this.closeButton = page.locator('data-test-id=modal-close-button');
    this.backButton = page.locator('data-test-id=modal-back-button');
  }

  async continue() {
    await this.continueButton.click();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async confirm() {
    await this.confirmButton.click();
  }

  async done() {
    await this.doneButton.click();
  }

  async back() {
    await this.backButton.click();
  }

  async close() {
    await this.closeButton.click();
  }
}
