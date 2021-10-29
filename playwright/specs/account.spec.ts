import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { AccountModal } from "../models/AccountModal";
import { DeviceAction } from "../models/DeviceAction";

// specific environment
test.use({ userdata: "skip-onboarding" });

const currencies = ["BTC", "LTC", "ATOM"];

test.describe.parallel("Accounts", () => {
  for (const currency of currencies) {
    test(`[${currency}] Add account`, async ({ page }) => {
      const accountModal = new AccountModal(page);
      const deviceAction = new DeviceAction(page);

      await test.step(`[${currency}] Open modal`, async () => {
        await accountModal.open();
        expect(await page.screenshot()).toMatchSnapshot(`open-modal.png`);
      });

      await test.step(`[${currency}] Select currency`, async () => {
        await accountModal.select(currency);
        expect(await page.screenshot()).toMatchSnapshot(`${currency}-select-currency.png`);
      });

      await test.step(`[${currency}] Open device app`, async () => {
        await deviceAction.openApp();
        expect(await page.screenshot()).toMatchSnapshot(`${currency}-device-open-app.png`);
      });

      await test.step(`[${currency}] Complete`, async () => {
        await accountModal.complete();
        expect(await page.screenshot()).toMatchSnapshot(`${currency}-complete.png`);
      });
    });
  }
});
