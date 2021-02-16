/* eslint-disable jest/no-export */
import { app, accountsPage, accountPage, modalPage } from "../../common.js";

const showOperations = (currency = "global") => {
  describe("account operations list", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
    });

    afterAll(async () => {
      await modalPage.close();
      await modalPage.waitForClosed();
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

      await modalPage.waitForDisplayed();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-account-operation-details`,
      });
    });
  });
};

export default showOperations;
