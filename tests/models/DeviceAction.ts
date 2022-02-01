import { Page, Locator } from "@playwright/test";
import {
  deviceInfo155 as deviceInfo,
  mockListAppsResult as innerMockListAppResult,
} from "@ledgerhq/live-common/lib/apps/mock";

const mockListAppsResult = (...params) => {
  // Nb Should move this polyfill to live-common eventually.
  const result = innerMockListAppResult(...params);
  Object.keys(result?.appByName).forEach(key => {
    result.appByName[key] = { ...result.appByName[key], type: "app" };
  });
  return result;
};

// fromTransactionRaw doesn't work as expected but I'm not sure why it produces the following error:
// page.evaluate: ReferenceError: _transaction is not defined
// import { fromTransactionRaw } from "@ledgerhq/live-common/lib/transaction";

export class DeviceAction {
  readonly page: Page;
  readonly deviceActionLoader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deviceActionLoader = page.locator("#deviceAction-loading");
  }

  async openApp() {
    await this.page.evaluate(() => {
      (window as any).mock.events.mockDeviceEvent({ type: "opened" });
    });

    await this.deviceActionLoader.waitFor({ state: "visible" });
    await this.deviceActionLoader.waitFor({ state: "detached" });
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

    await this.deviceActionLoader.waitFor({ state: "hidden" });
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

    await this.deviceActionLoader.waitFor({ state: "hidden" });
  }

  async complete() {
    await this.page.evaluate(() => {
      (window as any).mock.events.mockDeviceEvent({ type: "complete" });
    });
  };

  async initiateSwap() {
    await this.page.evaluate(() => {
      (window as any).mock.events.mockDeviceEvent(
        { type: "opened" },
        { type: "complete" },
        { type: "init-swap-requested" },
      );
    });

    await this.page.waitForSelector("data-test-id=device-confirm-swap", { state: "visible" });
  }

  async confirmSwap() {
    await this.page.evaluate(() => {
      // Transaction taken from original test here (and not using fromRawTransaction)
      // https://github.com/LedgerHQ/ledger-live-desktop/blob/7a7ae3218f941dea5b9cdb2637acaa026b4f4a10/tests/specs/swap.spec.js
      (window as any).mock.events.mockDeviceEvent(
        {
          type: "init-swap-result",
          initSwapResult: {
            transaction: {
              amount: { s: 1, e: 0, c: [1] },
              recipient: "1Cz2ZXb6Y6AacXJTpo4RBjQMLEmscuxD8e",
              rbf: false,
              utxoStrategy: { strategy: 0, pickUnconfirmedRBF: false, excludeUTXOs: [] },
              family: "bitcoin",
              feePerByte: { s: 1, e: 0, c: [1] },
              networkInfo: {
                family: "bitcoin",
                feeItems: {
                  items: [
                    { key: "0", speed: "high", feePerByte: "3" },
                    { key: "1", speed: "standard", feePerByte: "2" },
                    { key: "2", speed: "low", feePerByte: "1" },
                  ],
                  defaultFeePerByte: 1,
                },
              },
              feesStrategy: undefined,
            },
            swapId: "12345",
          },
        },
        {
          type: "complete",
        },
      );
    });
  }

  async silentSign() {
    await this.page.evaluate(() => {
      (window as any).mock.events.mockDeviceEvent({ type: "opened" }, { type: "complete" });
    });
  }
}
