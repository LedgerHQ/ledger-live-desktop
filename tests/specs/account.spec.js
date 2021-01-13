import initialize, { app, mockDeviceEvent, modalPage } from "../common.js";

describe("Account", () => {
  initialize("account", {
    userData: "onboardingcompleted",
  });

  const $ = selector => app.client.$(selector);

  describe("add accounts flow", () => {
    // Add accounts for all currencies with special flows (delegate, vote, etc)
    const currencies = ["dogecoin", "xrp", "ethereum_classic", "tezos", "cosmos"];
    for (let i = 0; i < currencies.length; i++) {
      it(`for ${currencies[i]}`, async () => {
        const currency = currencies[i];
        const addAccountId = !i
          ? "#accounts-empty-state-add-account-button"
          : "#accounts-add-account-button";
        const elemAddAccountId = await $(addAccountId);
        await elemAddAccountId.waitForDisplayed();
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
        if (!i) {
          const elemDrawerAccountsButton = await $("#drawer-accounts-button");
          await elemDrawerAccountsButton.click();
        }
        expect(await modalPage.isDisplayed(true)).toBe(false);
      });
    }
  });

  describe("add token accounts flow", () => {
    afterAll(async () => await modalPage.close());
    it("token when parent missing", async () => {
      const addAccountButton = await $("#accounts-add-account-button");
      await addAccountButton.waitForDisplayed();
      await addAccountButton.click();
      const elemSelectControl = await $("#modal-container .select__control");
      await elemSelectControl.click();
      const elemSelectControlInput = await $("#modal-container .select__control input");
      await elemSelectControlInput.addValue("chainlink");
      const elemFirstOption = await $(".select-options-list .option:first-child");
      await elemFirstOption.click();
      const elemAddParentButton = await $("#modal-token-continue-button");
      await elemAddParentButton.waitForDisplayed();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "addAccount-tokenWithoutParent",
      });
    });
    it("receive token when subAccount exist already", async () => {
      // Add parent account
      const elemAddParentButton = await $("#modal-token-continue-button");
      await elemAddParentButton.click();
      await mockDeviceEvent({ type: "opened" });
      const elemImportAddButton = await $("#add-accounts-import-add-button");
      await elemImportAddButton.waitForDisplayed();
      await elemImportAddButton.waitForEnabled();
      await elemImportAddButton.click();
      const elemAddMoreButon = await $("#add-accounts-finish-add-more-button");
      await elemAddMoreButon.waitForDisplayed();
      await elemAddMoreButon.click();
      // Select subAccount
      const elemSelectControlInput = await $("#modal-container .select__control input");
      await elemSelectControlInput.addValue("tether");
      const elemFirstOption = await $(".select-options-list .option:first-child");
      await elemFirstOption.click();
      await elemAddParentButton.waitForDisplayed();
      await elemAddParentButton.click();
      const elemReceiveButton = await $("#receive-account-continue-button");
      await elemReceiveButton.waitForDisplayed();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "addAccount-selectSubAccount",
      });
    });
    it("receive new token", async () => {
      await modalPage.close();
      const addAccountButton = await $("#accounts-add-account-button");
      await addAccountButton.waitForDisplayed();
      await addAccountButton.waitForEnabled();
      await addAccountButton.click();
      const elemSelectControl = await $("#modal-container .select__control");
      await elemSelectControl.click();
      const elemSelectControlInput = await $("#modal-container .select__control input");
      await elemSelectControlInput.addValue("chainlink");
      const elemFirstOption = await $(".select-options-list .option:first-child");
      await elemFirstOption.click();
      // Select parent account
      const elemAddParentButton = await $("#modal-token-continue-button");
      await elemAddParentButton.waitForDisplayed();
      await elemAddParentButton.click();
      const elemReceiveContinueButton = await $("#receive-account-continue-button");
      await elemReceiveContinueButton.waitForDisplayed();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "addAccount-selectParent",
      });
    });
  });

  describe("account flows", () => {
    it("account migration flow", async () => {
      // Account migration flow
      const drawerAccountsButton = await $("#drawer-accounts-button");
      await drawerAccountsButton.click();
      const migrateAccountsButton = await $("#modal-migrate-accounts-button");
      await migrateAccountsButton.waitForDisplayed();
      await migrateAccountsButton.click();
      const migrateOverViewStartButton = await $("#migrate-overview-start-button");
      await migrateOverViewStartButton.waitForDisplayed();
      await migrateOverViewStartButton.click();
      await mockDeviceEvent({ type: "opened" });
      const migrateCurrencyContinueButton = await $("#migrate-currency-continue-button");
      await migrateCurrencyContinueButton.waitForDisplayed();
      await migrateCurrencyContinueButton.click();
      await mockDeviceEvent({ type: "opened" });
      await migrateCurrencyContinueButton.waitForDisplayed();
      await migrateCurrencyContinueButton.click();
      const migrateOverviewExportButton = await $("#migrate-overview-export-button");
      await migrateOverviewExportButton.waitForDisplayed();
      await migrateOverviewExportButton.click();
      const exportAccountsDoneButton = await $("#export-accounts-done-button");
      await exportAccountsDoneButton.waitForDisplayed();
      await exportAccountsDoneButton.click();
      const migrateOverviewDoneButton = await $("#migrate-overview-done-button");
      await migrateOverviewDoneButton.click();
      expect(await modalPage.isDisplayed(true)).toBe(false);
    });

    it("receive flow", async () => {
      // Receive flow without device
      const drawerReceiveButton = await $("#drawer-receive-button");
      await drawerReceiveButton.click();
      const receiveAccountContinueButton = await $("#receive-account-continue-button");
      await receiveAccountContinueButton.waitForDisplayed();
      await receiveAccountContinueButton.click();
      await mockDeviceEvent({ type: "opened" }, { type: "complete" });
      const receiveReceiveContinueButton = await $("#receive-receive-continue-button");
      await receiveReceiveContinueButton.waitForDisplayed();
      await receiveReceiveContinueButton.waitForEnabled();
      await receiveReceiveContinueButton.click();
      expect(await modalPage.isDisplayed(true)).toBe(false);
    });

    it("send flow", async () => {
      // Send flow
      const sendButton = await $("#drawer-send-button");
      await sendButton.click();
      const recipientInput = await $("#send-recipient-input");
      await recipientInput.click();
      await recipientInput.addValue("1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA");
      const recipientContinueButton = await $("#send-recipient-continue-button");
      await recipientContinueButton.waitForEnabled();
      await recipientContinueButton.click();
      const amountContinueButton = await $("#send-amount-continue-button");
      await amountContinueButton.click();
      const summaryContinueButton = await $("#send-summary-continue-button");
      await summaryContinueButton.click();
      await mockDeviceEvent({ type: "opened" });
      const confirmationOPCButton = await $("#send-confirmation-opc-button");
      await confirmationOPCButton.waitForDisplayed({ timeout: 10000 });
      await confirmationOPCButton.waitForEnabled();
      await confirmationOPCButton.click();
      await modalPage.isDisplayed();
      await modalPage.close();
      expect(await modalPage.isDisplayed(true)).toBe(false);
    });

    it("cosmos delegate flow", async () => {
      // Cosmos delegate flow
      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();
      const searchInput = await $("#accounts-search-input");
      await searchInput.addValue("cosmos");
      const firstAccountRowItme = await $(".accounts-account-row-item:first-child");
      await firstAccountRowItme.waitForDisplayed();
      await firstAccountRowItme.click();
      const delegateButton = await $("#account-delegate-button");
      await delegateButton.waitForDisplayed();
      await delegateButton.click();
      const delegateListFirstInput = await $("#delegate-list input:first-child");
      await delegateListFirstInput.waitForDisplayed();
      await delegateListFirstInput.addValue("1.5");
      const delegateContinueButton = await $("#delegate-continue-button");
      await delegateContinueButton.waitForDisplayed();
      await delegateContinueButton.waitForEnabled();
      await delegateContinueButton.click();
      await mockDeviceEvent({ type: "opened" });
      await modalPage.close();
      expect(await modalPage.isDisplayed(true)).toBe(false);
    });

    it("tezos delegate flow", async () => {
      // Tezos delegate flow'
      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();
      const searchInput = await $("#accounts-search-input");
      await searchInput.addValue("tezos");
      const accountRowFirstItem = await $(".accounts-account-row-item:first-child");
      await accountRowFirstItem.waitForDisplayed();
      await accountRowFirstItem.click();
      const delegatebutton = await $("#account-delegate-button");
      await delegatebutton.waitForDisplayed();
      await delegatebutton.click();
      const starterContinueButton = await $("#delegate-starter-continue-button");
      await starterContinueButton.click();
      const summaryContinueButton = await $("#delegate-summary-continue-button");
      await summaryContinueButton.waitForDisplayed();
      await summaryContinueButton.waitForEnabled();
      await summaryContinueButton.click();
      await mockDeviceEvent({ type: "opened" });
      await modalPage.close();
      expect(await modalPage.isDisplayed(true)).toBe(false);
    });
  });

  describe("sort accounts", () => {
    it("sort account default", async () => {
      const isModalOpen = await modalPage.isDisplayed(true);

      if (isModalOpen) {
        await modalPage.close();
      }

      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "sort-account-default",
      });
    });

    it("sort account lowest balance", async () => {
      const sortSelectButton = await $("#accounts-order-select-button");
      await sortSelectButton.click();

      const sortLowestBalanceButton = await $("#accounts-order-select-balance-asc");
      await sortLowestBalanceButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "sort-account-lowest-balance",
      });
    });

    it("sort account name A-Z", async () => {
      const sortSelectButton = await $("#accounts-order-select-button");
      await sortSelectButton.click();

      const sortNameAscButton = await $("#accounts-order-select-name-asc");
      await sortNameAscButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "sort-account-name-asc",
      });
    });

    it("sort account name Z-A", async () => {
      const sortSelectButton = await $("#accounts-order-select-button");
      await sortSelectButton.click();

      const sortNameDescButton = await $("#accounts-order-select-name-desc");
      await sortNameDescButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "sort-account-name-desc",
      });
    });

    it("sort account highest balance", async () => {
      const sortSelectButton = await $("#accounts-order-select-button");
      await sortSelectButton.click();

      const sortHighestBalanceButton = await $("#accounts-order-select-balance-desc");
      await sortHighestBalanceButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "sort-account-highest-balance",
      });
    });
  });

  describe("range and display accounts", () => {
    it("display grid", async () => {
      const displayGridButton = await $("#accounts-display-grid");
      await displayGridButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "account-display-grid",
      });
    });

    it("display list", async () => {
      const displayListButton = await $("#accounts-display-list");
      await displayListButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "sort-account-highest-balance",
      });
    });
  });

  describe("remove accounts flow", () => {
    it("displays a list of accounts", async () => {
      const isModalOpen = await modalPage.isDisplayed(true);

      if (isModalOpen) {
        await modalPage.close();
      }

      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "remove-account-before",
      });
    });

    it("remove one account", async () => {
      const firstAccountRow = await $(".accounts-account-row-item");

      await firstAccountRow.click();
      const settingsButton = await $("#account-settings-button");
      await settingsButton.click();
      await modalPage.isDisplayed();
      const deleteButton = await $("#account-settings-delete");
      await deleteButton.click();

      const confirmButton = await $("#modal-confirm-button");
      await confirmButton.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "remove-account-after",
      });
    });
  });
});
