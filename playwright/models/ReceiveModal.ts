import { Page, Locator } from "@playwright/test";
import { Modal } from "./Modal";

export class ReceiveModal extends Modal{
    readonly page: Page;
    readonly continueButton: Locator;
    readonly skipDeviceButton: Locator;
    readonly verifyMyAddressButton: Locator;
    readonly doneButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.continueButton = page.locator("button:has-text('Continue')");
        this.skipDeviceButton = page.locator("data-test-id=receive-connect-device-skip-device-button");
        this.verifyMyAddressButton = page.locator("data-test-id=receive-verify-address-button");
        this.doneButton = page.locator("data-test-id=receive-receive-continue-button");
    }

    async continue() {
        await this.continueButton.click();
    }

    async skipDevice() {
        await this.skipDeviceButton.click();
    }

    async complete() {
        await this.continueButton.click();
        await this.doneButton.click();
    }
}
