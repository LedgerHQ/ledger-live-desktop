/* eslint-disable jest/no-export */
import { app, accountsPage } from "../../common.js";

const rangeAndDisplay = (currency = "global") => {
  describe("range and display accounts", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
    });

    it("display grid", async () => {
      await accountsPage.changeAccountsDisplay("grid");

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-account-display-grid`,
      });
    });

    it("display list", async () => {
      await accountsPage.changeAccountsDisplay("list");

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-accounts-display-list`,
      });
    });
  });
};

export default rangeAndDisplay;
