/* eslint-disable jest/no-export */
import { app, accountSettingsModal, accountsPage, accountPage } from "../../common.js";

const editAccountName = (currency = "global") => {
  describe("edit name flow", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
    });

    it("show name of account before", async () => {
      const firstAccountRow = await accountsPage.getFirstAccountRow();
      await accountsPage.clickOnAccountRow(firstAccountRow);

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-edit-account-name-before`,
      });
    });

    it("edit account name", async () => {
      const settingsButton = await accountPage.settingsButton;
      await settingsButton.click();

      const newName = "New account name";
      await accountSettingsModal.editAccountName(newName);

      const accountName = await accountPage.accountHeaderName;
      const value = await accountName.getValue();
      expect(value).toBe(newName);
    });

    it("show name of account after", async () => {
      const optimisticOperations = await app.client.$(".optimistic-operation");
      await optimisticOperations.waitForExist({reverse: true, timeout: 5000});

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-edit-account-name-after`,
      });
    });
  });
};

export default editAccountName;
