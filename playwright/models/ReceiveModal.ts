import { Page, Locator } from "@playwright/test";
import { Modal } from "./Modal";

export class ReceiveModal extends Modal {
  readonly page: Page;
  readonly skipDeviceButton: Locator;
  readonly verifyMyAddressButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.skipDeviceButton = page.locator("data-test-id=receive-connect-device-skip-device-button");
    this.verifyMyAddressButton = page.locator("data-test-id=receive-verify-address-button");
  }

  async skipDevice() {
    await this.skipDeviceButton.click();
  }
}
