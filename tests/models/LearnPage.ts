import { Page, FrameLocator } from "@playwright/test";

export class LearnPage {
  readonly page: Page;
  readonly iframe: FrameLocator;

  constructor(page: Page) {
    this.page = page;
    this.iframe = page.frameLocator("data-test-id=learn-content-iframe");
  }

  async waitForIFrame() {
    await this.iframe.locator("text=Learn").waitFor({ state: "visible" });
  }
}
