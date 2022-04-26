import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { AddAccountModal } from "../models/AddAccountModal";
import { DeviceAction } from "../models/DeviceAction";
import { Layout } from "../models/Layout";

test.use({ userdata: "skip-onboarding" });

const currencies = ["BTC", "LTC", "ETH", "ATOM", "XTZ", "XRP"];

test.describe.parallel("Accounts", () => {
  for (const currency of currencies) {
    test(`[${currency}] Add account`, async ({ page }) => {
      const addAccountModal = new AddAccountModal(page);
      const deviceAction = new DeviceAction(page);
      const layout = new Layout(page);

      await test.step(`[${currency}] Open modal`, async () => {
        await addAccountModal.open();
        expect(await addAccountModal.title.textContent()).toBe("Add accounts");
        expect(await addAccountModal.container.screenshot()).toMatchSnapshot(`open-modal.png`);
      });

      await test.step(`[${currency}] Select currency`, async () => {
        await addAccountModal.select(currency);
        expect(await addAccountModal.container.screenshot()).toMatchSnapshot(
          `${currency}-select.png`,
        );
        await addAccountModal.continue();
      });

      await test.step(`[${currency}] Open device app`, async () => {
        await deviceAction.openApp();
        await addAccountModal.stopButton.isVisible();
        await addAccountModal.addAccountsButton.waitFor({ state: "visible" });
        expect(await addAccountModal.container.screenshot()).toMatchSnapshot(
          `${currency}-accounts-list.png`,
        );
      });

      await test.step(`[${currency}] Scan and add accounts`, async () => {
        await addAccountModal.addAccounts();
        expect(await addAccountModal.container.screenshot()).toMatchSnapshot(
          `${currency}-success.png`,
        );
      });

      await test.step(`[${currency}] Done`, async () => {
        await addAccountModal.done();
        await layout.totalBalance.waitFor({ state: "visible" });
        expect(await page.screenshot()).toMatchSnapshot(`${currency}-complete.png`);
      });
    });
  }
});
