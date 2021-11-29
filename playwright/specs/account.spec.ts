import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { AccountModal } from "../models/AccountModal";
import { DeviceAction } from "../models/DeviceAction";

// specific environment
test.use({ userdata: "skip-onboarding" });

const currencies = ["BTC", "LTC", "ETH", "ATOM", "XTZ", "XRP"];

test.describe.parallel("Accounts", () => {
  for (const currency of currencies) {
    test(`[${currency}] Add account`, async ({ page }) => {
      const accountModal = new AccountModal(page);
      const deviceAction = new DeviceAction(page);

      await test.step(`[${currency}] Open modal`, async () => {
        await accountModal.open();
      });

      await test.step(`[${currency}] Select currency`, async () => {
        await accountModal.select(currency);
      });

      await test.step(`[${currency}] Open device app`, async () => {
        await deviceAction.openApp();
        expect(await page.screenshot()).toMatchSnapshot(`${currency}-device-open-app.png`);
      });

      await test.step(`[${currency}] Add accounts`, async () => {
        await accountModal.addAccounts(currency);
        expect(await page.screenshot()).toMatchSnapshot(`${currency}-complete.png`);
      });
    });
  }
});
