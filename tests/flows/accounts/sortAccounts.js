/* eslint-disable jest/no-export */
import { app, accountsPage } from "../../common.js";

const sortAccounts = (currency = "global") => {
  describe("sort accounts", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
    });

    it("sort account default", async () => {
      await accountsPage.goToAccounts();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-sort-account-default`,
      });
    });

    it("sort account lowest balance", async () => {
      await accountsPage.sortAccounts("lowestBalance");

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-sort-account-balance`,
      });
    });

    it("sort account name A-Z", async () => {
      await accountsPage.sortAccounts("AZ");

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-sort-account-name-asc`,
      });
    });

    it("sort account name Z-A", async () => {
      await accountsPage.sortAccounts("ZA");

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-sort-account-name-desc`,
      });
    });

    it("sort account highest balance", async () => {
      await accountsPage.sortAccounts("highestBalance");

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-sort-account-highest-balance`,
      });
    });
  });
};

export default sortAccounts;
