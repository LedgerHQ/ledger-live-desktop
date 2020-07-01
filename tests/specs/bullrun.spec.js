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

  const $ = selector => app.client.element(selector);

  it("opens a window", () => {
    return app.client
      .waitUntilWindowLoaded()
      .getWindowCount()
      .then(count => expect(count).toBe(1))
      .browserWindow.isMinimized()
      .then(minimized => expect(minimized).toBe(false))
      .browserWindow.isVisible()
      .then(visible => expect(visible).toBe(true))
      .browserWindow.isFocused()
      .then(focused => expect(focused).toBe(true))
      .getTitle()
      .then(title => {
        expect(title).toBe(data.appTitle);
      });
  });

  it("go through onboarding-1", async () => {
    await app.client.waitForVisible("#onboarding-get-started-button", 20000);
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
    await modalPage.closeButton.click();
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
    await modalPage.closeButton.click();
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
    await app.client.waitForVisible("#onboarding-continue-button");
    await onboardingPage.continue();
    await passwordPage.skip();
    await analyticsPage.dataFakeLink.click();
    await modalPage.close();
    await analyticsPage.shareFakeLink.click();
    await modalPage.close();
    await analyticsPage.shareSwitch.click();
    await analyticsPage.shareSwitch.click();
    await analyticsPage.logsSwitch.click();
    await analyticsPage.logsSwitch.click();
    await onboardingPage.continue();
    await onboardingPage.open();
    await modalPage.isVisible();
    await modalPage.termsCheckbox.click();
    await app.client.waitForEnabled("#modal-confirm-button");
    await modalPage.confirmButton.click();

    expect(true).toBeTruthy();
  });

  it("access manager", async () => {
    // Access manager and go through firmware update
    await $("#drawer-manager-button").click();
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
    await app.client.waitForExist("#manager-update-firmware-button", 100000);
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-0-manager-page",
    });
  });
  it("firmware update flow-2", async () => {
    $("#manager-update-firmware-button").click();
    await app.client.waitForExist("#firmware-update-disclaimer-modal-seed-ready-checkbox");
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-1-disclaimer-modal",
    });
  });
  it("firmware update flow-3", async () => {
    $("#firmware-update-disclaimer-modal-seed-ready-checkbox").click();
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-2-disclaimer-modal-checkbox",
    });
  });
  it("firmware update flow-5", async () => {
    $("#firmware-update-disclaimer-modal-continue-button").click();
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-4-disclaimer-modal-continue-2",
    });
  });
  it("firmware update flow-6", async () => {
    await mockDeviceEvent({}, { type: "complete" }); // .complete() install full firmware -> flash mcu
    await app.client.waitForExist("#firmware-update-flash-mcu-title");
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-5-flash-mcu-start",
    });
  });
  it("firmware update flow-7", async () => {
    await mockDeviceEvent({}, { type: "complete" }); // .complete() flash mcu -> completed
    await app.client.waitForExist("#firmware-update-completed-close-button");
    await delay(6000); // wait initial delay of the ui
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-6-flash-mcu-done",
    });
  });
  it("firmware update flow-8", async () => {
    $("#firmware-update-completed-close-button").click();
    await delay(1000);
    image = await app.browserWindow.capturePage();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-7-close-modal",
    });
  });
  it("firmware update flow-9", async () => {
    await $("#drawer-dashboard-button").click();
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
        await app.client.waitForExist(addAccountId);
        await $(addAccountId).click();
        await $("#modal-container .select__control").click();
        await $("#modal-container .select__control input").addValue(currency);
        await $(".select-options-list .option:first-child").click();
        await $("#modal-continue-button").click();
        await mockDeviceEvent({ type: "opened" });
        await app.client.waitForExist("#add-accounts-import-add-button", 20000);
        await app.client.waitForEnabled("#add-accounts-import-add-button", 20000);
        await $("#add-accounts-import-add-button").click();
        await $("#modal-close-button").click();
        if (!i) {
          await $("#drawer-accounts-button").click();
        }
        expect(true).toBeTruthy();
      });
    }
  });

  describe("account flows", () => {
    afterEach(async () => {
      const modalBackDrop = await app.client.isExisting("#modal-backdrop");
      if (modalBackDrop) await $("#modal-backdrop").click();
      await delay(1000);
    });
    it("account migration flow", async () => {
      // Account migration flow
      await $("#drawer-dashboard-button").click();
      await app.client.waitForExist("#modal-migrate-accounts-button");
      await $("#modal-migrate-accounts-button").click();
      await $("#migrate-overview-start-button").click();
      await mockDeviceEvent({ type: "opened" });
      await app.client.waitForExist("#migrate-currency-continue-button", 20000);
      await $("#migrate-currency-continue-button").click();
      await mockDeviceEvent({ type: "opened" });
      await app.client.waitForExist("#migrate-currency-continue-button", 20000);
      await $("#migrate-currency-continue-button").click();
      await $("#migrate-overview-export-button").click();
      await app.client.pause(2000);
      await app.client.waitForExist("#export-accounts-done-button");
      await $("#export-accounts-done-button").click();
      await $("#migrate-overview-done-button").click();
      expect(true).toBeTruthy();
    });

    it("receive flow", async () => {
      // Receive flow without device
      await $("#drawer-receive-button").click();
      await $("#receive-account-continue-button").click();
      await mockDeviceEvent({ type: "opened" }, { type: "complete" });
      await app.client.waitForEnabled("#receive-receive-continue-button", 20000);
      await $("#receive-receive-continue-button").click();
      expect(true).toBeTruthy();
    });

    it("send flow", async () => {
      // Send flow
      await $("#drawer-send-button").click();
      await $("#send-recipient-input").click();
      await $("#send-recipient-input").addValue("1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA");
      await app.client.waitForEnabled("#send-recipient-continue-button");
      await $("#send-recipient-continue-button").click();
      await $("#send-amount-continue-button").click();
      await $("#send-summary-continue-button").click();
      await mockDeviceEvent({ type: "opened" });
      await app.client.waitForExist("#send-confirmation-opc-button", 60000);
      await app.client.waitForEnabled("#send-confirmation-opc-button");
      await $("#send-confirmation-opc-button").click();
      await $("#modal-close-button").click();
      expect(true).toBeTruthy();
    });

    it("cosmos delegate flow", async () => {
      // Cosmos delegate flow
      await $("#drawer-accounts-button").click();
      await $("#accounts-search-input").addValue("cosmos");
      await app.client.waitForExist(".accounts-account-row-item:first-child");
      await $(".accounts-account-row-item:first-child").click();
      await app.client.waitForExist("#account-delegate-button");
      await $("#account-delegate-button").click();
      await app.client.waitForExist("#delegate-list input:first-child");
      await $("#delegate-list input:first-child").addValue("1.5");
      await delay(1000);
      await app.client.waitForEnabled("#delegate-continue-button");
      await $("#delegate-continue-button").click();
      await mockDeviceEvent({ type: "opened" });
      await $("#modal-close-button").click();
      expect(true).toBeTruthy();
    });

    it("tezos delegate flow", async () => {
      // Tezos delegate flow
      await $("#drawer-accounts-button").click();
      await $("#accounts-search-input").addValue("tezos");
      await app.client.waitForExist(".accounts-account-row-item:first-child");
      await $(".accounts-account-row-item:first-child").click();
      await app.client.waitForExist("#account-delegate-button");
      await $("#account-delegate-button").click();
      await $("#delegate-starter-continue-button").click();
      await delay(1000);
      await app.client.waitForEnabled("#delegate-summary-continue-button");
      await $("#delegate-summary-continue-button").click();
      await mockDeviceEvent({ type: "opened" });
      await $("#modal-close-button").click();
      expect(true).toBeTruthy();
    });
  });

  it("naive discreet mode toggle and assorted screens", async () => {
    // Toggle discreet mode twice
    await $("#topbar-discreet-button").click();
    await $("#topbar-discreet-button").click();

    await $("#drawer-dashboard-button").click();
    await $("#drawer-exchange-button").click();

    // Open settings and navigate all tabs
    await $("#topbar-settings-button").click();

    // Open settings and navigate all tabs
    await $("#settings-currencies-tab").click();
    await $("#settings-accounts-tab").click();
    await $("#settings-about-tab").click();
    await $("#settings-help-tab").click();
    await $("#settings-experimental-tab").click();

    expect(1).toEqual(1);
  });
});
