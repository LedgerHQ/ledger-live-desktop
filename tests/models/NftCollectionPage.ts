import { Page, Locator } from "@playwright/test";

export class NftCollectionPage {
  readonly page: Page;
  readonly collectionItemsList: Locator;
  readonly collectionItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.collectionItemsList = page.locator("data-test-id=collection-nft-items-list");
    this.collectionItem = page.locator("data-test-id=collection-nft-item");
  }

  async openNftDetails(nftName: string) {
    await this.page.click(`text="${nftName}"`);
  }
}
