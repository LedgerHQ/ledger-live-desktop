/* eslint-disable jest/no-export */
import invariant from "invariant";
import {
  app,
  mockDeviceEvent,
  addAccountsModal,
  accountsPage,
  portfolioPage,
} from "../../common.js";

let nbAccounts = 0;

const addAccount = currency => {
  invariant(currency, "currency is needed");

  describe(`add accounts`, () => {
    it("before adding accounts", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-add-account-before`,
      });
    });

    it(`prepare ${currency} flow`, async () => {
      const exists = await portfolioPage.isAddAccountAvailable();

      // true if there are accounts already imported
      if (!exists) {
        await portfolioPage.goToAccounts();
        const accs = await accountsPage.getAccountsRows();
        nbAccounts = accs.length;
      }

      const addAccountButton = exists
        ? await portfolioPage.emtpyStateAddAccountButton()
        : await accountsPage.addAccountButton();
      await addAccountButton.click();
      await addAccountsModal.waitForDisplayed();
      await addAccountsModal.prepareAddAccount(currency);

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-add-account-fill-input`,
      });
    });

    it(`completes the add account flow`, async () => {
      await addAccountsModal.finishAddAccount(mockDeviceEvent);

      // counter value refresh.
      await app.client.pause(2000);

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
