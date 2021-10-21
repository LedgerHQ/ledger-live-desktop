import { Page } from '@playwright/test';
import {
  deviceInfo155 as deviceInfo,
  mockListAppsResult,
} from "@ledgerhq/live-common/lib/apps/mock";

export class DeviceAction {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openApp() {
    await this.page.evaluate(() => {
      window.mock.events.mockDeviceEvent({ type: "opened" });
    });

    await this.page.waitForSelector("#deviceAction-loading", { state: "visible" });
  }

  async genuineCheck() {
    const result = mockListAppsResult("Bitcoin", "Bitcoin", deviceInfo);

    await this.page.evaluate((args) => {
      const [ deviceInfo, result ] = args;

      window.mock.events.mockDeviceEvent({
        type: "listingApps",
        deviceInfo,
      },
      {
        type: "result",
        result,
      },
      { type: "complete" });
    }, [ deviceInfo, result ]);

    await this.page.waitForSelector("#deviceAction-loading", { state: "hidden" });
  }

  async manager() {
    const result = mockListAppsResult("Bitcoin,Ethereum,Litecoin,Stellar,Tron,Ripple,Polkadot","Bitcoin,Ethereum (outdated)", deviceInfo);

    await this.page.evaluate((args) => {
      const [ deviceInfo, result ] = args;

      window.mock.events.mockDeviceEvent({
        type: "listingApps",
        deviceInfo,
      },
      {
        type: "result",
        result,
      },
      { type: "complete" });
    }, [ deviceInfo, result ]);

    await this.page.waitForSelector("#deviceAction-loading", { state: "hidden" });
  }
};
