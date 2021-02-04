/* eslint-disable jest/no-export */
import invariant from "invariant";
import {
  app,
  mockDeviceEvent,
  addAccountsModal,
  accountsPage,
  portfolioPage,
} from "../../common.js";

const addAccount = currency => {
  invariant(currency, "currency is needed");

  describe(`add accounts`, () => {
    it("before adding accounts", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-add-account-before`,
      });
    });

    it(`${currency} flow`, async () => {
      const exists = await portfolioPage.isAddAccountAvailable();
      let nbAccounts = 0;

      // true if there are accounts already imported
      if (!exists) {
        await portfolioPage.goToAccounts();
        const accs = await accountsPage.getAccountsRows();
        nbAccounts = accs.length;
      }

      const addAccountButton = exists
        ? await portfolioPage.emtpyStateAddAccountButton
        : await accountsPage.addAccountButton;
      await addAccountButton.click();
      await addAccountsModal.waitForDisplayed();
      await addAccountsModal.addAccountFlow(currency, mockDeviceEvent);
      await addAccountsModal.close();

      await accountsPage.goToAccounts();
      const accounts = await accountsPage.getAccountsRows();

      expect(accounts.length).toBeGreaterThan(nbAccounts);
    });

    it("display a list with the newly added accounts", async () => {
      await app.client.pause(1000);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-add-account-after`,
      });
    });
  });
};

export default addAccount;
