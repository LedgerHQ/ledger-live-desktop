import {
  deviceInfo155 as deviceInfo,
  mockListAppsResult,
} from "@ledgerhq/live-common/lib/apps/mock";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { delay } from "@ledgerhq/live-common/lib/promise";
import { applicationProxy, removeUserData, getMockDeviceEvent } from "../applicationProxy";
import OnboardingPage from "../po/onboarding.page";
import ModalPage from "../po/modal.page";
import GenuinePage from "../po/genuine.page";
import PasswordPage from "../po/password.page";
import AnalyticsPage from "../po/analytics.page";
// import PortfolioPage from "../po/portfolio.page";
import data from "../data/onboarding/";

expect.extend({ toMatchImageSnapshot });

jest.setTimeout(600000);

describe("Bullrun", () => {
  let app;
  let image;
  let onboardingPage;
  let modalPage;
  let genuinePage;
  let passwordPage;
  let analyticsPage;
  // let portfolioPage;
  let mockDeviceEvent;

  beforeAll(async () => {
    app = await applicationProxy({
      MOCK: true,
      DISABLE_MOCK_POINTER_EVENTS: true,
      HIDE_DEBUG_MOCK: true,
    });
    onboardingPage = new OnboardingPage(app);
    modalPage = new ModalPage(app);
    genuinePage = new GenuinePage(app);
    passwordPage = new PasswordPage(app);
    analyticsPage = new AnalyticsPage(app);
    // portfolioPage = new PortfolioPage(app);
    mockDeviceEvent = getMockDeviceEvent(app);

    return app.start();
  });

  afterAll(async () => {
    return app.stop().then(() => removeUserData());
  });

  const $ = selector => app.client.$(selector);

  it("opens a window", async () => {
    await app.client.waitUntilWindowLoaded();
    await app.client.getWindowCount().then(count => expect(count).toBe(1));
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
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-1-get-started",
    });
  });

  it("go through onboarding-2", async () => {
    await onboardingPage.selectConfiguration("new");
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-2-screen-new",
    });
  });
  it("go through onboarding-3", async () => {
    await onboardingPage.selectDevice("nanox");
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
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

    expect(true).toBeTruthy();
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
    await elem.waitForExist({ timeout: 100000 });
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-0-manager-page",
    });
  });

  it("firmware update flow-2", async () => {
    const button = await $("#manager-update-firmware-button");
    await button.click();
    const elem = await $("#firmware-update-disclaimer-modal-seed-ready-checkbox");
    await elem.waitForExist();
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-1-disclaimer-modal",
    });
  });

  it("firmware update flow-3", async () => {
    const elem = await $("#firmware-update-disclaimer-modal-seed-ready-checkbox");
    await elem.click();
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-2-disclaimer-modal-checkbox",
    });
  });

  it("firmware update flow-5", async () => {
    const elem = await $("#firmware-update-disclaimer-modal-continue-button");
    await elem.click();
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-4-disclaimer-modal-continue-2",
    });
  });

  it("firmware update flow-6", async () => {
    await mockDeviceEvent({}, { type: "complete" }); // .complete() install full firmware -> flash mcu
    const elem = await $("#firmware-update-flash-mcu-title");
    await elem.waitForExist();
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-5-flash-mcu-start",
    });
  });

  it("firmware update flow-7", async () => {
    await mockDeviceEvent({}, { type: "complete" }); // .complete() flash mcu -> completed
    const elem = await $("#firmware-update-completed-close-button");
    await elem.waitForExist();
    await delay(6000); // wait initial delay of the ui
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-6-flash-mcu-done",
    });
  });

  it("firmware update flow-8", async () => {
    const elem = await $("#firmware-update-completed-close-button");
    await elem.click();
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-7-close-modal",
    });
  });

  it("firmware update flow-9", async () => {
    const elem = await $("#drawer-dashboard-button");
    await elem.click();
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
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
        await elemAddAccountId.waitForExist();
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
        await elemImportAddButton.waitForExist({ timeout: 20000 });
        await elemImportAddButton.waitForEnabled({ timeout: 20000 });
        await elemImportAddButton.click();
        await modalPage.close();
        if (!i) {
          const elemDrawerAccountsButton = await $("#drawer-accounts-button");
          await elemDrawerAccountsButton.click();
        }
        expect(true).toBeTruthy();
      });
    }
  });

  describe("account flows", () => {
    afterEach(async () => {
      const modalBackDrop = await $("#modal-backdrop");
      await modalBackDrop.isExisting();
      if (modalBackDrop) await modalBackDrop.click();
      await delay(1000);
    });

    it("account migration flow", async () => {
      // Account migration flow
      const drawerDashboardButton = await $("#drawer-dashboard-button");
      await drawerDashboardButton.click();
      const migrateAccountsButton = await $("#modal-migrate-accounts-button");
      await migrateAccountsButton.waitForExist();
      await migrateAccountsButton.click();
      const migrateOverViewStartButton = await $("#migrate-overview-start-button");
      await migrateOverViewStartButton.click();
      await mockDeviceEvent({ type: "opened" });
      const migrateCurrencyContinueButton = await $("#migrate-currency-continue-button", 20000);
      await migrateCurrencyContinueButton.waitForExist({ timeout: 2000 });
      await migrateCurrencyContinueButton.click();
      await mockDeviceEvent({ type: "opened" });
      await migrateCurrencyContinueButton.waitForExist({ timeout: 2000 });
      await migrateCurrencyContinueButton.click();
      const migrateOverviewExportButton = await $("#migrate-overview-export-button");
      await migrateOverviewExportButton.click();
      await app.client.pause(2000);
      const exportAccountsDoneButton = await $("#export-accounts-done-button");
      await exportAccountsDoneButton.waitForExist();
      await exportAccountsDoneButton.click();
      const migrateOverviewDoneButton = await $("#migrate-overview-done-button");
      await migrateOverviewDoneButton.click();
      expect(true).toBeTruthy();
    });

    it("receive flow", async () => {
      // Receive flow without device
      const drawerReceiveButton = await $("#drawer-receive-button");
      await drawerReceiveButton.click();
      const receiveAccountContinueButton = $("#receive-account-continue-button");
      await receiveAccountContinueButton.click();
      await mockDeviceEvent({ type: "opened" }, { type: "complete" });
      const receiveReceiveContinueButton = await $("#receive-receive-continue-button");
      await receiveReceiveContinueButton.waitForEnabled({ timeout: 2000 });
      await receiveReceiveContinueButton.click();
      expect(true).toBeTruthy();
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
      await confirmationOPCButton.waitForExist({ timeout: 60000 });
      await confirmationOPCButton.waitForEnabled();
      await confirmationOPCButton.click();
      await modalPage.close();
      expect(true).toBeTruthy();
    });

    it("cosmos delegate flow", async () => {
      // Cosmos delegate flow
      const accountsButton = await $("#drawer-accounts-button");
      const searchInput = await $("#accounts-search-input");
      await accountsButton.click();
      await searchInput.addValue("cosmos");
      const firstAccountRowItme = await $(".accounts-account-row-item:first-child");
      await firstAccountRowItme.waitForExist();
      await firstAccountRowItme.click();
      const delegateButton = await $("#account-delegate-button");
      await delegateButton.waitForExist();
      await delegateButton.click();
      const delegateListFirstInput = await $("#delegate-list input:first-child");
      await delegateListFirstInput.waitForExist();
      await delegateListFirstInput.addValue("1.5");
      await delay(1000);
      const delegateContinueButton = await $("#delegate-continue-button");
      await delegateContinueButton.waitForEnabled();
      await delegateContinueButton.click();
      await mockDeviceEvent({ type: "opened" });
      await modalPage.close();
      expect(true).toBeTruthy();
    });

    it("tezos delegate flow", async () => {
      // Tezos delegate flow'
      const accountsButton = await $("#drawer-accounts-button");
      await accountsButton.click();
      const searchInput = await $("#accounts-search-input");
      await searchInput.addValue("tezos");
      const accountRowFirstItem = await $(".accounts-account-row-item:first-child");
      await accountRowFirstItem.waitForExist();
      await accountRowFirstItem.click();
      const delegatebutton = await $("#account-delegate-button");
      await delegatebutton.waitForExist();
      await delegatebutton.click();
      const starterContinueButton = await $("#delegate-starter-continue-button");
      await starterContinueButton.click();
      await delay(1000);
      const summaryContinueButton = await $("#delegate-summary-continue-button");
      await summaryContinueButton.waitForEnabled();
      await summaryContinueButton.click();
      await mockDeviceEvent({ type: "opened" });
      await modalPage.close();
      expect(true).toBeTruthy();
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

    expect(1).toEqual(1);
  });
});
