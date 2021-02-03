/* eslint-disable jest/no-export */
import { app, accountSettingsModal, accountsPage, accountPage } from "../../common.js";

const removeAccount = (currency = "global") => {
  describe("remove accounts flow", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
    });

    it("displays a list of accounts", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-remove-account-before`,
      });
    });

    it("removes one account", async () => {
      const accounts = await accountsPage.getAccountsRows();
      const length = accounts.length;

      const firstAccountRow = accounts[0];
      await firstAccountRow.click();

      const settingsButton = await accountPage.settingsButton;
      await settingsButton.click();
      await accountSettingsModal.isDisplayed();
      const deleteButton = await accountSettingsModal.settingsDeleteButton;
      await deleteButton.click();

      await accountSettingsModal.confirm();

      await accountsPage.goToAccounts();
      const newAccounts = await accountsPage.getAccountsRows();
      const newLength = newAccounts.length;
      expect(newLength).toBe(length - 1);
    });

    it("displays a modified list of accounts", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-remove-account-after`,
      });
    });
  });
};

export default removeAccount;
