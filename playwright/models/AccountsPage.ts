import { Page, Locator } from '@playwright/test';

export class AccountsPage {
    readonly page: Page;
    readonly addAccountButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.addAccountButton = page.locator('data-test-id=accounts-add-account-button');
    }

    async goToAddAccount() {
        await this.addAccountButton.click();
    }
}
