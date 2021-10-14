import { Page } from '@playwright/test';
import {
  deviceInfo155 as deviceInfo,
  mockListAppsResult,
} from "@ledgerhq/live-common/lib/apps/mock";

export class Device {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openApp() {
    this.page.evaluate(() => {
      window.mock.events.mockDeviceEvent({ type: "opened" });
    });
  }

  async genuineCheck() {
    console.log(mockListAppsResult("Bitcoin", "Bitcoin", deviceInfo));
    this.page.evaluate(() => {
      window.mock.events.mockDeviceEvent({
        type: "listingApps",
        deviceInfo,
      },
      {
        type: "result",
        result: mockListAppsResult("Bitcoin", "Bitcoin", deviceInfo),
      },
      { type: "complete" });
    });
  }
};
