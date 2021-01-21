/* eslint-disable jest/no-export */
import invariant from "invariant";
import { app, mockDeviceEvent, modalPage } from "../../common.js";

const $ = selector => app.client.$(selector);

export const addAccount = currency => {
  invariant(currency, "currency is needed");

  describe(`add accounts`, () => {
    it("before adding accounts", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-add-account-before`,
      });
    });

    it(`${currency} flow`, async () => {
      const emptyStateButton = await $("#accounts-empty-state-add-account-button");
      const exists = await emptyStateButton.isExisting();
      const drawerAccountsButton = await $("#drawer-accounts-button");
      let nbAccounts = 0;
      let accountsList;
      let accounts;

      // true if there are accounts already imported
      if (!exists) {
        await drawerAccountsButton.click();
        accountsList = await $("#accounts-list");
        accounts = await accountsList.$$(".accounts-account-row-item");
        nbAccounts = accounts.length;
      }

      const elemAddAccountId = exists ? emptyStateButton : await $("#accounts-add-account-button");
      await elemAddAccountId.click();
      const elemSelectControl = await $("#modal-container .select__control");
      await elemSelectControl.click();
      const elemSelectControlInput = await $("#modal-container .select__control input");
      await elemSelectControlInput.addValue(currency);
      const elemFirstOption = await $(".select-options-list .option:first-child");
      await elemFirstOption.click();
      const elemContinueButton = await $("#modal-continue-button");
      await elemContinueButton.click();
      await mockDeviceEvent({ type: "opened" });
      const elemImportAddButton = await $("#add-accounts-import-add-button");
      await elemImportAddButton.waitForDisplayed();
      await elemImportAddButton.waitForEnabled();
      await elemImportAddButton.click();
      await modalPage.close();

      await drawerAccountsButton.click();

      accountsList = await $("#accounts-list");
      accounts = await accountsList.$$(".accounts-account-row-item");

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

export const sortAccounts = (currency = "global") => {
  describe("sort accounts", () => {
    beforeAll(async () => {
      const drawerAccountsButton = await $("#drawer-accounts-button");
      await drawerAccountsButton.click();
    });

    it("sort account default", async () => {
      const isModalOpen = await modalPage.isDisplayed(true);

      if (isModalOpen) {
        await modalPage.close();
      }

      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-sort-account-default`,
      });
    });

    it("sort account lowest balance", async () => {
      const sortSelectButton = await $("#accounts-order-select-button");
      await sortSelectButton.click();

      const sortLowestBalanceButton = await $("#accounts-order-select-balance-asc");
      await sortLowestBalanceButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-sort-account-balance`,
      });
    });

    it("sort account name A-Z", async () => {
      const sortSelectButton = await $("#accounts-order-select-button");
      await sortSelectButton.click();

      const sortNameAscButton = await $("#accounts-order-select-name-asc");
      await sortNameAscButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-sort-account-name-asc`,
      });
    });

    it("sort account name Z-A", async () => {
      const sortSelectButton = await $("#accounts-order-select-button");
      await sortSelectButton.click();

      const sortNameDescButton = await $("#accounts-order-select-name-desc");
      await sortNameDescButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-sort-account-name-desc`,
      });
    });

    it("sort account highest balance", async () => {
      const sortSelectButton = await $("#accounts-order-select-button");
      await sortSelectButton.click();

      const sortHighestBalanceButton = await $("#accounts-order-select-balance-desc");
      await sortHighestBalanceButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-sort-account-highest-balance`,
      });
    });
  });
};

export const rangeAndDisplay = (currency = "global") => {
  describe("range and display accounts", () => {
    beforeAll(async () => {
      const drawerAccountsButton = await $("#drawer-accounts-button");
      await drawerAccountsButton.click();
    });

    it("display grid", async () => {
      const displayGridButton = await $("#accounts-display-grid");
      await displayGridButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-account-display-grid`,
      });
    });

    it("display list", async () => {
      const displayListButton = await $("#accounts-display-list");
      await displayListButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-accounts-display-list`,
      });
    });
  });
};

const removeAccount = (currency = "global") => {
  describe("remove accounts flow", () => {
    beforeAll(async () => {
      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();
    });

    it("displays a list of accounts", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-remove-account-before`,
      });
    });

    it("removes one account", async () => {
      let listOfAccounts = await $("#accounts-list");
      const accounts = await listOfAccounts.$$(".accounts-account-row-item");
      const length = accounts.length;

      const firstAccountRow = accounts[0];
      await firstAccountRow.click();

      const settingsButton = await $("#account-settings-button");
      await settingsButton.click();
      await modalPage.isDisplayed();
      const deleteButton = await $("#account-settings-delete");
      await deleteButton.click();

      const confirmButton = await $("#modal-confirm-button");
      await confirmButton.click();

      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();
      listOfAccounts = await $("#accounts-list");
      const newAccounts = await listOfAccounts.$$(".accounts-account-row-item");
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

const editAccountName = (currency = "global") => {
  describe("edit name flow", () => {
    beforeAll(async () => {
      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();
    });

    it("show name of account before", async () => {
      const firstAccountRow = await $(".accounts-account-row-item");
      await firstAccountRow.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-edit-account-name-before`,
      });
    });

    it("edit account name", async () => {
      const settingsButton = await $("#account-settings-button");
      await settingsButton.click();

      const input = await $("#input-edit-name");
      await input.waitForDisplayed();
      const newName = "New account name";
      await input.addValue(newName);

      const applyButton = await $("#account-settings-apply");
      await applyButton.click();

      const accountName = await $("#account-header-name");
      const value = await accountName.getValue();
      expect(value).toBe(newName);
    });

    it("show name of account after", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-edit-account-name-after`,
      });
    });
  });
};

export const bookmarkAccount = (currency = "global") => {
  describe("bookmark account", () => {
    beforeAll(async () => {
      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();
    });

    if (currency !== "global") {
      it("should not have any bookmarked account", async () => {
        const bookmarkedAccountsList = await $("#bookmarked-accounts");
        const bookmarkedAccounts = await bookmarkedAccountsList.$$(".bookmarked-account-item");

        expect(bookmarkedAccounts).toHaveLength(0);
      });
    }

    it("bookmark the first account", async () => {
      const listOfAccounts = await $("#accounts-list");
      const accounts = await listOfAccounts.$$(".accounts-account-row-item");

      const bookmarkedAccountsList = await $("#bookmarked-accounts");
      let bookmarkedAccounts = await bookmarkedAccountsList.$$(".bookmarked-account-item");
      const bookmarkedAccountLength = bookmarkedAccounts.length;

      const firstAccountRow = accounts[0];
      await firstAccountRow.click();

      const starButton = await $("#account-star-button");
      await starButton.click();

      bookmarkedAccounts = await bookmarkedAccountsList.$$(".bookmarked-account-item");

      expect(bookmarkedAccounts).toHaveLength(bookmarkedAccountLength + 1);
    });

    it("displays a newly bookmarked account in the side menu", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-bookmark-account`,
      });
    });
  });
};

export const exportAccountsToMobile = (currency = "global") => {
  describe("export accounts to mobile", () => {
    beforeAll(async () => {
      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();
    });

    it("opens the export accounts modal", async () => {
      const optionsButton = await $("#accounts-options-button");
      await optionsButton.click();

      const exportAccountsButton = await $("#accounts-button-exportAccounts");
      await exportAccountsButton.click();

      expect(await modalPage.isDisplayed()).toBe(true);
    });

    it("displays a QRCode", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-export-account-to-mobile-modal`,
      });
    });

    it("closes the export accounts modal", async () => {
      const doneButton = await $("#export-accounts-done-button");
      await doneButton.click();

      expect(await modalPage.isDisplayed(true)).toBe(false);
    });
  });
};

export const exportOperationsHistory = (currency = "global") => {
  describe("exports the operations history", () => {
    beforeAll(async () => {
      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();
    });

    it("opens the export operations history modal", async () => {
      const optionsButton = await $("#accounts-options-button");
      await optionsButton.click();

      const exportOperationsHistoryButton = await $("#accounts-button-exportOperations");
      await exportOperationsHistoryButton.click();

      expect(await modalPage.isDisplayed()).toBe(true);
    });

    it("displays a list of accounts", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-export-operations-history-modal-open`,
      });
    });

    it("save button should be disabled", async () => {
      const saveButton = await $("#export-operations-save-button");
      expect(await saveButton.isClickable()).toBe(false);
    });

    it("selects the first two accounts", async () => {
      const accountsList = await $("#accounts-list-selectable");
      const accounts = await accountsList.$$(".account-row");
      const firstAccount = accounts[0];
      const secondAccount = accounts[1];

      await firstAccount.click();
      await secondAccount.click();

      const firstInput = await firstAccount.$("input");
      const secondInput = await secondAccount.$("input");

      expect(await firstInput.isSelected()).toBe(true);
      expect(await secondInput.isSelected()).toBe(true);
    });

    it("save button should be enabled", async () => {
      const saveButton = await $("#export-operations-save-button");
      expect(await saveButton.isClickable()).toBe(true);
    });

    it("displays a list with first two accounts selected", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-export-operations-history-modal-accounts-selected`,
      });
    });

    it("closes the export operations history modal", async () => {
      const closeButton = await $("#modal-close-button");
      await closeButton.click();

      expect(await modalPage.isDisplayed(true)).toBe(false);
    });
  });
};

export const hideToken = (currency = "global") => {
  describe("hide token account", () => {
    beforeAll(async () => {
      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();
    });

    it("opens an account with tokens", async () => {
      const listOfAccounts = await $("#accounts-list");
      const accounts = await listOfAccounts.$$(".accounts-account-row-item.has-tokens");

      const firstAccountWithTokens = accounts[0];
      await firstAccountWithTokens.click();

      expect(true).toBe(true);

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-hide-token-before`,
      });
    });

    it("hides the first token in list", async () => {
      await app.client.pause(1000);
      const tokensList = await $("#tokens-list");
      const tokens = await tokensList.$$(".token-row");
      const tokensLength = tokens.length;

      const firstToken = await tokens[0];
      await firstToken.click({ button: "right" });

      const hideToken = await $("#token-menu-hide");
      await hideToken.click();

      const confirmButton = await $("#hide-token-button");
      await confirmButton.click();
      await modalPage.isDisplayed(true);

      const newTokens = await tokensList.$$(".token-row");
      expect(newTokens).toHaveLength(tokensLength - 1);
    });

    it("displays a modified tokens list", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-hide-token-after`,
      });
    });
  });
};

export const globalAccountsFlows = () => {
  sortAccounts();
  rangeAndDisplay();
  editAccountName();
  bookmarkAccount();
  exportAccountsToMobile();
  exportOperationsHistory();
  hideToken();
};

export const accountsFlows = currency => {
  sortAccounts(currency);
  rangeAndDisplay(currency);
  removeAccount(currency);
  editAccountName(currency);
  bookmarkAccount(currency);
  exportAccountsToMobile(currency);
  exportOperationsHistory(currency);
};

export const accountsWithTokenFlows = currency => {
  sortAccounts(currency);
  rangeAndDisplay(currency);
  removeAccount(currency);
  editAccountName(currency);
  bookmarkAccount(currency);
  exportAccountsToMobile(currency);
  exportOperationsHistory(currency);
  hideToken(currency);
};
