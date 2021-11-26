import { Page } from "@playwright/test";
import {
  deviceInfo155 as deviceInfo,
  mockListAppsResult,
} from "@ledgerhq/live-common/lib/apps/mock";
import { fromTransactionRaw } from "@ledgerhq/live-common/lib/transaction";

export class DeviceAction {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openApp() {
    await this.page.evaluate(() => {
      (window as any).mock.events.mockDeviceEvent({ type: "opened" });
    });

    await this.page.waitForSelector("#deviceAction-loading", { state: "visible" });
  }

  async genuineCheck(appDesc: string = "Bitcoin", installedDesc: string = "Bitcoin") {
    const result = mockListAppsResult(appDesc, installedDesc, deviceInfo);

    await this.page.evaluate(
      args => {
        const [deviceInfo, result] = args;

        (window as any).mock.events.mockDeviceEvent(
          {
            type: "listingApps",
            deviceInfo,
          },
          {
            type: "result",
            result,
          },
          { type: "complete" },
        );
      },
      [deviceInfo, result],
    );

    await this.page.waitForSelector("#deviceAction-loading", { state: "hidden" });
  }

  async accessManager(
    appDesc: string = "Bitcoin,Tron,Litecoin,Ethereum,Ripple,Stellar",
    installedDesc: string = "Bitcoin,Litecoin,Ethereum (outdated)",
  ) {
    const result = mockListAppsResult(appDesc, installedDesc, deviceInfo);

    await this.page.evaluate(
      args => {
        const [deviceInfo, result] = args;

        (window as any).mock.events.mockDeviceEvent(
          {
            type: "listingApps",
            deviceInfo,
          },
          {
            type: "result",
            result,
          },
          { type: "complete" },
        );
      },
      [deviceInfo, result],
    );

    await this.page.waitForSelector("#deviceAction-loading", { state: "hidden" });
  }

  async initiateSwap() {
    await this.page.evaluate(() => {
      (window as any).mock.events.mockDeviceEvent(
          { type: "opened" }, { type: "complete" }, { type: "init-swap-requested" });
    });

    await this.page.waitForSelector("data-test-id=device-confirm-swap", { state: "visible" });
  }

  async confirmSwap() {
    await this.page.evaluate(() => {
      (window as any).mock.events.mockDeviceEvent(
        {
          type: "init-swap-result",
          initSwapResult: {
            transaction: {
              amount: { s: 1, e: 0, c: [ 1 ] },
              recipient: '1Cz2ZXb6Y6AacXJTpo4RBjQMLEmscuxD8e',
              rbf: false,
              utxoStrategy: { strategy: 0, pickUnconfirmedRBF: false, excludeUTXOs: [] },
              family: 'bitcoin',
              feePerByte: { s: 1, e: 0, c: [ 1 ] },
              networkInfo: {
                family: 'bitcoin',
                feeItems: { items: [
                  { key: "0", speed: "high", feePerByte: "3" },
                  { key: "1", speed: "standard", feePerByte: "2" },
                  { key: "2", speed: "low", feePerByte: "1" },
                ], defaultFeePerByte: 1 }
              },
            feesStrategy: undefined
          },
            swapId: "12345",
          }
        },
        {
          type: "complete"
        }
      )
    });
  }

  async silentSign() {
    await this.page.evaluate(() => {
      (window as any).mock.events.mockDeviceEvent({ type: "opened" }, { type: "complete"});
    });
  }
}

