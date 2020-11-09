import initialize, {
  app,
  deviceInfo,
  mockListAppsResult,
  mockDeviceEvent,
  onboardingPage,
  modalPage,
  genuinePage,
  passwordPage,
  analyticsPage,
  // portfolioPage,
} from "../common.js";
import data from "../data/onboarding/";

describe("Bullrun", () => {
  initialize();

  const $ = selector => app.client.$(selector);

  it("opens a window", async () => {
    await app.client.waitUntilWindowLoaded();
    await app.client.browserWindow.isMinimized().then(minimized => expect(minimized).toBe(false));
    await app.client.browserWindow.isVisible().then(visible => expect(visible).toBe(true));
    await app.client.browserWindow.isFocused().then(focused => expect(focused).toBe(true));
    await app.client.getTitle().then(title => {
      expect(title).toBe(data.appTitle);
    });
  });

  it("go through onboarding-1", async () => {
    const elem = await $("#onboarding-get-started-button");
    await elem.waitForDisplayed({ timeout: 20000 });
    await onboardingPage.getStarted();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-1-get-started",
    });
  });

  it("go through onboarding-2", async () => {
    await onboardingPage.selectConfiguration("new");
    await app.client.pause(500);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-2-screen-new",
    });
  });
  it("go through onboarding-3", async () => {
    await onboardingPage.selectDevice("nanox");
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-3-screen-nano-x",
    });
  });
  it("go through onboarding-4", async () => {
    await onboardingPage.continue();
    await onboardingPage.continue();
    await onboardingPage.continue();
    await genuinePage.checkPin(true);
    await genuinePage.checkSeed(true);
    await genuinePage.check();
    await modalPage.close();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.selectConfiguration("restore");
    await onboardingPage.selectDevice("blue");
    await onboardingPage.continue();
    await onboardingPage.continue();
    await onboardingPage.continue();
    await genuinePage.checkPin(true);
    await genuinePage.checkSeed(true);
    await genuinePage.check();
    await modalPage.close();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.selectConfiguration("nodevice");
    await onboardingPage.back();
    await onboardingPage.selectConfiguration("initialized");
    await onboardingPage.selectDevice("nanos");
    await onboardingPage.continue();
    await genuinePage.checkPin(false);
    await onboardingPage.back();
    await genuinePage.checkPin(true);
    await genuinePage.checkSeed(false);
    await onboardingPage.back();
    await genuinePage.checkPin(true);
    await genuinePage.checkSeed(true);
    await genuinePage.check();
    await mockDeviceEvent(
      {
        type: "listingApps",
        deviceInfo,
      },
      {
        type: "result",
        result: mockListAppsResult("Bitcoin", "Bitcoin", deviceInfo),
      },
      { type: "complete" },
    );
    await app.client.pause(2000);
    const onboardingContinueButton = await $("#onboarding-continue-button");
    await onboardingContinueButton.waitForDisplayed();
    await onboardingPage.continue();
    await passwordPage.skip();
    const analyticsDataFakeLinkElem = await analyticsPage.dataFakeLink;
    await analyticsDataFakeLinkElem.click();
    await modalPage.close();
    const analyticsShareFakeLinkElem = await analyticsPage.shareFakeLink;
    await analyticsShareFakeLinkElem.click();
    await modalPage.close();
    const analyticsShareSwitch = await analyticsPage.shareSwitch;
    await analyticsShareSwitch.click();
    await analyticsShareSwitch.click();
    const analyticsLogsSwitch = await analyticsPage.logsSwitch;
    await analyticsLogsSwitch.click();
    await analyticsLogsSwitch.click();
    await onboardingPage.continue();
    await onboardingPage.open();
    await modalPage.isDisplayed();
    const modalTermsCheckbox = await modalPage.termsCheckbox;
    await modalTermsCheckbox.click();
    const modalConfirmButton = await $("#modal-confirm-button");
    await modalConfirmButton.waitForEnabled();
    await modalPage.confirm();

    expect(await modalPage.isDisplayed(true)).toBe(false);
  });

  it("access manager", async () => {
    // Access manager and go through firmware update
    const elem = await $("#drawer-manager-button");
    await elem.click();
    await mockDeviceEvent(
      {
        type: "listingApps",
        deviceInfo,
      },
      {
        type: "result",
        result: mockListAppsResult("Bitcoin, Ethereum, Stellar", "Bitcoin", deviceInfo),
      },
      { type: "complete" },
    );
    expect(true).toBeTruthy();
  });

  it("firmware update flow-1", async () => {
    const elem = await $("#manager-update-firmware-button");
    await elem.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-0-manager-page",
    });
  });

  it("firmware update flow-2", async () => {
    const button = await $("#manager-update-firmware-button");
    await button.click();
    const elem = await $("#firmware-update-disclaimer-modal-seed-ready-checkbox");
    await elem.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-1-disclaimer-modal",
    });
  });

  it("firmware update flow-3", async () => {
    const elem = await $("#firmware-update-disclaimer-modal-seed-ready-checkbox");
    await elem.click();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-2-disclaimer-modal-checkbox",
    });
  });

  it("firmware update flow-5", async () => {
    const continueButton = await $("#firmware-update-disclaimer-modal-continue-button");
    await continueButton.click();
    const elem = await $("#firmware-update-download-mcu-title");
    await elem.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-4-download-mcu-modal",
    });
  });

  it("firmware update flow-6", async () => {
    await mockDeviceEvent({}, { type: "complete" }); // .complete() install full firmware -> flash mcu
    const elem = await $("#firmware-update-flash-mcu-title");
    await elem.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-5-flash-mcu-start",
    });
  });

  it("firmware update flow-7", async () => {
    await mockDeviceEvent({}, { type: "complete" }); // .complete() flash mcu -> completed
    const elem = await $("#firmware-update-completed-close-button");
    await elem.waitForDisplayed();
    expect(await app.client.screenshot(6000)).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-6-flash-mcu-done",
    });
  });

  it("firmware update flow-8", async () => {
    const elem = await $("#firmware-update-completed-close-button");
    await elem.click();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-7-close-modal",
    });
  });

  it("firmware update flow-9", async () => {
    const elem = await $("#drawer-dashboard-button");
    await elem.click();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-8-back-to-dashboard",
    });
  });

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

  it("naive discreet mode toggle and assorted screens", async () => {
    // Toggle discreet mode twice
    const discreetButton = await $("#topbar-discreet-button");
    await discreetButton.click();
    await discreetButton.click();

    const dashboardButton = await $("#drawer-dashboard-button");
    await dashboardButton.click();
    const exchangeButton = await $("#drawer-exchange-button");
    await exchangeButton.click();

    // Open settings and navigate all tabs
    const settingsButton = await $("#topbar-settings-button");
    await settingsButton.click();

    // Open settings and navigate all tabs
    const currenciesTab = await $("#settings-currencies-tab");
    await currenciesTab.click();
    const accountsTab = await $("#settings-accounts-tab");
    await accountsTab.click();
    const aboutTab = await $("#settings-about-tab");
    await aboutTab.click();
    const helpTab = await $("#settings-help-tab");
    await helpTab.click();
    const experimentalTab = await $("#settings-experimental-tab");
    await experimentalTab.click();
    expect(await modalPage.isDisplayed(true)).toBe(false);
  });
});
