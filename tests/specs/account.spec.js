import initialize, { app, mockDeviceEvent, modalPage } from "../common.js";

describe("Account", () => {
  initialize("account", {
    userData: "onboardingcompleted",
  });

  const $ = selector => app.client.$(selector);

  describe("add accounts flow", () => {
    // Add accounts for all currencies with special flows (delegate, vote, etc)
    const currencies = ["dogecoin", "ethereum", "xrp", "ethereum_classic", "tezos", "cosmos"];
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
});
