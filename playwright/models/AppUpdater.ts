import { Page } from "@playwright/test";

export class AppUpdater {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async setStatus(s: string) {
    await this.page.evaluate(() => {
      (window as any).mock.updater.setStatus(s);
    }, [s]);
  }
}
