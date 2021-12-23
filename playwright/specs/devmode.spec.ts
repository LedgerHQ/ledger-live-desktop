import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../models/Layout";
import { Modal } from "../models/Modal";
import { AccountsPage } from "../models/AccountsPage";
import { AddAccountModal } from "../models/AddAccountModal";
import { SettingsPage } from "../models/SettingsPage";
import { DeviceAction } from "../models/DeviceAction";

test.use({ userdata: "1AccountBTC1AccountETH" });
const currencies = ["bitcoin_testnet", "ethereum_ropsten", "MUON"];

test("Enable dev mode from settings", async ({ page }) => {
  const layout = new Layout(page);
  const modal = new Modal(page);
  const accountsPage = new AccountsPage(page);
  const addAccountModal = new AddAccountModal(page);
  const settingsPage = new SettingsPage(page);
  const deviceAction = new DeviceAction(page);

  for (const currency of currencies) {
    await test.step(`when devMode OFF -> ${currency} shouldn't be available`, async () => {
      await layout.goToAccounts();
      await accountsPage.openAddAccountModal();
      await addAccountModal.select(currency);
      expect(await addAccountModal.container.screenshot()).toMatchSnapshot(
        `empty-result-${currency}.png`,
      );
      await addAccountModal.selectAccountInput.press("Escape");
    });
  }

  await test.step("User should be able to enable devMode", async () => {
    await layout.goToSettings();
    await settingsPage.goToExperimentalTab();
    await settingsPage.enableDevMode();
    expect(await page.screenshot()).toMatchSnapshot("devMode-on.png");
  });

  for (const currency of currencies) {
    await test.step(`${currency} currencies should be available`, async () => {
      await layout.goToAccounts();
      await accountsPage.openAddAccountModal();
      await addAccountModal.select(currency);
      expect(await addAccountModal.container.screenshot()).toMatchSnapshot(
        `${currency}-isAvailable.png`,
      );
    });

    await test.step(`User should be able to add ${currency} accounts`, async () => {
      await modal.continue();
      await deviceAction.openApp();
      await addAccountModal.waitForSync();
      expect(await addAccountModal.container.screenshot()).toMatchSnapshot(
        `scan-${currency}-accounts.png`,
      );
      await addAccountModal.addAccounts();
      await addAccountModal.done();
    });
  }
});
