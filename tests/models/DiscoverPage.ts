import { Page, Locator } from "@playwright/test";

export class DiscoverPage {
  readonly page: Page;
  readonly discoverMenuButton: Locator;
  readonly testAppCatalogItem: Locator;
  readonly liveAppDisclaimerContinueButton: Locator;
  readonly disclaimerText: Locator;
  readonly getAllAccountsButton: Locator;
  readonly requestAccountButton: Locator;
  readonly modal: Locator;
  readonly selectAccountTitle: Locator;
  readonly selectAccountDropdown: Locator;
  readonly selectBtcAccount: Locator;
  readonly modalContinueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.discoverMenuButton = page.locator("data-test-id=drawer-catalog-button");
    this.testAppCatalogItem = page.locator("#platform-catalog-app-playwright-test-live-app");
    this.liveAppDisclaimerContinueButton = page.locator("button:has-text('Continue')");
    this.disclaimerText = page.locator("text=External Application");
    this.getAllAccountsButton = page.locator("data-test-id=get-all-accounts-button"); // TODO: make this into its own model
    this.requestAccountButton = page.locator("data-test-id=request-single-account-button");
    this.modal = page.locator("data-test-id=modal-container");
    this.selectAccountTitle = page.locator("text=Choose a crypto asset)");

    // FIXME: the bellow select dropdown at src/renderer/components/SelectAccountAndCurrency.js
    //        is tricky to grab a hold of (subtree intercepts pointer events), need to find a
    //        way of grabbing these custom elements
    this.selectAccountDropdown = page.locator("//*[@data-test-id='select-account-dropdown']/div");
    this.selectBtcAccount = page.locator("text=Bitcoin (BTC)");
    this.modalContinueButton = page.locator("button:has-text('Continue')");
  }

  async navigateToCatalog() {
    await this.discoverMenuButton.click();
  }

  async openTestApp() {
    await this.testAppCatalogItem.click();
  }

  async waitForDisclaimerToBeVisible() {
    await this.disclaimerText.waitFor({ state: "visible" });
    await this.disclaimerText.click();
  }

  async acceptLiveAppDisclaimer() {
    await this.liveAppDisclaimerContinueButton.click();
  }

  async waitForSelectAccountModalToBeVisible() {
    await this.modal.waitFor({ state: "visible" });
    await this.modal.click(); // hack to force the modal to be visible for the subsequent screenshot check
  }

  async getAccountsList() {
    await this.clickWebviewElement("[data-test-id=get-all-accounts-button]");
  }

  async requestAccount() {
    await this.clickWebviewElement("[data-test-id=request-single-account-button]");
    this.waitForSelectAccountModalToBeVisible();
  }

  async openAccountDropdown() {
    // FIXME - this isn't working without force. 'subtree intercepts pointer events' error
    await this.selectAccountDropdown.click({ force: true });
  }

  async selectAccount() {
    // TODO: make this dynamic with passed in variable
    await this.selectBtcAccount.click({ force: true });
  }

  async exitModal() {
    // TODO: use modal.ts model
    await this.modalContinueButton.click({ force: true });
  }

  async verifyAddress() {
    await this.clickWebviewElement("[data-test-id=verify-address-button]]");
  }

  async clickWebviewElement(elementName: string) {
    await this.page.evaluate(elementName => {
      const webview = document.querySelector("webview");
      (webview as any).executeJavaScript(
        `(function() {
        const element = document.querySelector('${elementName}');
        element.click();
      })();
    `,
      );
    }, elementName);
  }

  // TODO: mocked device events for test
}