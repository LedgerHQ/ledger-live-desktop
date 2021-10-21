import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { AccountModal } from "../models/AccountModal";
import { DeviceAction } from "../models/DeviceAction";

// Comment out to disable recorder
// process.env.PWDEBUG = "1";

// specific environments
test.use({ userdata: "skip-onboarding" });

const currencies = ["BTC"];

test.describe.parallel("Currencies", () => {
  for (const currency of currencies) {
    test(`[${currency}] Add account`, async ({ page }) => {
      const accountModal = new AccountModal(page);
      const deviceAction = new DeviceAction(page);

      await test.step(`[${currency}] Open modal`, async () => {
        await accountModal.add();
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`open-modal.png`);
      });

      await test.step(`[${currency}] Select currency`, async () => {
        await accountModal.select(currency);
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
          `${currency}-select-currency.png`,
        );
      });

      await test.step(`[${currency}] Open device app`, async () => {
        await deviceAction.openApp();
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
          `${currency}-device-open-app.png`,
        );
      });

      await test.step(`[${currency}] Complete`, async () => {
        await accountModal.complete();
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
          `${currency}-complete.png`,
        );
      });
    });
  }
});
