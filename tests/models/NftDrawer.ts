import { Page, Locator } from "@playwright/test";

export class NftDetailsDrawer {
  readonly page: Page;
  readonly nftDrawerContent: Locator;
  readonly nftImage: Locator;
  readonly sendButton: Locator;
  readonly externalLinksButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nftDrawerContent = page.locator("data-test-id=nft-details-drawer");
    this.nftImage = page.locator("data-test-id=nft-drawer-image");
    this.sendButton = page.locator("data-test-id=nft-drawer-send-button");
    this.externalLinksButton = page.locator("#accounts-options-button");
  }
}
