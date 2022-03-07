import { Page, Locator } from "@playwright/test";

export class NftGalleryPage {
  readonly page: Page;
  readonly gridViewButton: Locator;
  readonly listViewButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gridViewButton = page.locator("data-test-id=gridview-button");
    this.listViewButton = page.locator("data-test-id=listview-button");
  }

  async showListView() {
    await this.listViewButton.click();
  }

  async showGridView() {
    await this.gridViewButton.click();
  }
}
