import { Page, Locator, expect } from "@playwright/test";

export class ReceiveModal {
    readonly page: Page;
    readonly continueButton: Locator;
    readonly skipDeviceButton: Locator;
    readonly verifyMyAddressButton: Locator;
    readonly doneButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.continueButton = page.locator('button:has-text("Continue")');
        this.skipDeviceButton = page.locator('#receive-connect-device-skip-device-button');
        this.verifyMyAddressButton = page.locator('#receive-verify-address-button');
        this.doneButton = page.locator('#receive-receive-continue-button');
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