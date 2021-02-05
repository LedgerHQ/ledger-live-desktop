/* eslint-disable jest/no-export */
import { app, accountsPage, accountPage, modalPage } from "../../common.js";

const showOperations = (currency = "global") => {
  describe("account operations list", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
    });

    it("show the first account", async () => {
      await accountsPage.searchAccount(currency);
      const firstAccountRow = await accountsPage.getFirstAccountRow();
      await firstAccountRow.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-account-operation-list`,
      });
    });
    it("show the first operation", async () => {
      await accountPage.clickFirstOperationRow();

      await modalPage.isDisplayed();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-account-operation-details`,
      });
      await modalPage.close();
    });
  });
};

export default showOperations;
