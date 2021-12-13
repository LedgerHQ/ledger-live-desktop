import { Page, Locator } from "@playwright/test";
import { Modal } from "./Modal";

export class FirmwareUpdateModal extends Modal {
  readonly page: Page;
  readonly readyCheckbox: Locator;
  readonly downloadProgress: Locator;
  readonly flashProgress: Locator;
  readonly updateDone: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.readyCheckbox = page.locator('data-test-id=firmware-update-ready-checkbox');
    this.downloadProgress = page.locator('data-test-id=firmware-update-download-progress');
    this.flashProgress = page.locator('data-test-id=firmware-update-flash-mcu-progress');
    this.updateDone = page.locator('data-test-id=firmware-update-done');
  }

  async tickCheckbox() {
    await this.readyCheckbox.click();
  }
}
