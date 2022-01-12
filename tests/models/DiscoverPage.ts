import { Page, Locator } from "@playwright/test";

export class DiscoverPage {
  readonly page: Page;
  readonly discoverMenuButton: Locator;
  readonly testAppCatalogItem: Locator;
  readonly liveAppDisclaimerContinueButton: Locator;
  readonly getAllAccountsButton: Locator;
  readonly requestAccountButton: Locator;
  readonly modal: Locator;
  readonly selectAccount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.discoverMenuButton = page.locator("data-test-id=drawer-catalog-button");
    this.testAppCatalogItem = page.locator("#platform-catalog-app-playwright-test-live-app");
    this.liveAppDisclaimerContinueButton = page.locator("button:has-text('Continue')");
    this.getAllAccountsButton = page.locator("data-test-id=get-all-accounts-button"); // TODO: make this into its own model
    this.requestAccountButton = page.locator("data-test-id=request-single-account-button");
    this.modal = page.locator("data-test-id=modal-container");
    // FIXME: the bellow select dropdown at src/renderer/components/SelectAccountAndCurrency.js
    //        is tricky to grab a hold of (subtree intercepts pointer events), need to find a
    //        way of grabbing these custom elements
    this.selectAccount = page.locator(
      "//*[@data-test-id='select-account-dropdown']/div/div/div[1]",
    );
  }

  async navigateToCatalog() {
    await this.discoverMenuButton.click();
  }

  async openTestApp() {
    await this.testAppCatalogItem.click();
  }

  async acceptLiveAppDisclaimer() {
    await this.liveAppDisclaimerContinueButton.click();
  }

  async getAccountsList() {
    // TODO: make this into a generic function for interacting with webview app elements
    await this.page.evaluate(() => {
      const webview = document.querySelector("webview");
      (webview as any).executeJavaScript(
        `(function() {
        const button = document.querySelector('[data-test-id=get-all-accounts-button]');
        button.click();
      })();
    `,
      );
    });
  }

  async requestAccount() {
    await this.page.evaluate(() => {
      const webview = document.querySelector("webview");
      (webview as any).executeJavaScript(
        `(function() {
        const button = document.querySelector('[data-test-id=request-single-account-button]');
        button.click();
      })();
    `,
      );
    });

    await this.modal.isVisible();

    // FIXME - this isn't working. See weird error from the above XPath
    // await this.selectAccount.click();
  }
}
