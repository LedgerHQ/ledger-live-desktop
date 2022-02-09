import { Page, Locator } from "@playwright/test";

export class AccountPage {
  readonly page: Page;
  readonly buttonsGroup: Locator;
  readonly settingsButton: Locator;
  readonly seeGalleryButton: Locator;
  readonly receiveNftButton: Locator;
  readonly nftCollectionsList: Locator;
  readonly accountPageContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountPageContainer = page.locator("data-test-id=account-container");
    this.buttonsGroup = page.locator("data-test-id=account-buttons-group");
    this.settingsButton = page.locator("data-test-id=account-settings-button");
    this.seeGalleryButton = page.locator("data-test-id=see-gallery-button");
    this.receiveNftButton = page.locator("data-test-id=receive-nft-button");
    this.nftCollectionsList = page.locator("data-test-id=nft-collections-list");
  }

  async goToGallery() {
    await this.seeGalleryButton.click();
  }

  async openCollection(collectionName: string) {
    await this.nftCollectionsList.locator(`text="${collectionName}"`).click();
  }
}
