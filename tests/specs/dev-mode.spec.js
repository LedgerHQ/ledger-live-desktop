import { applicationProxy, removeUserData, getMockDeviceEvent } from "../applicationProxy";
import {
  deviceInfo155 as deviceInfo,
  mockListAppsResult,
} from "@ledgerhq/live-common/lib/apps/mock";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import PortfolioPage from "../po/portfolio.page";
import AccountsPage from "../po/accounts.page";
import ModalPage from "../po/modal.page";
import SettingsPage from "../po/settings.page";
import ManagerPage from "../po/manager.page";
import OnboardingData from "../data/onboarding/";
import SettingsData from "../data/settings";
import PortfolioData from "../data/portfolio";
import ManagerData from "../data/manager";
import AccountsData from "../data/accounts";

expect.extend({ toMatchImageSnapshot });

jest.setTimeout(60000);

describe("When user activate developer mode", () => {
  let app;
  let portfolioPage;
  let accountsPage;
  let settingsPage;
  let managerPage;
  let modalPage;
  let mockDeviceEvent;
  let image;

  beforeAll(() => {
    app = applicationProxy(
      { MOCK: true, DISABLE_MOCK_POINTER_EVENTS: true, HIDE_DEBUG_MOCK: true },
      "empty-state",
    );
    portfolioPage = new PortfolioPage(app);
    accountsPage = new AccountsPage(app);
    modalPage = new ModalPage(app);
    settingsPage = new SettingsPage(app);
    managerPage = new ManagerPage(app);
    accountsPage = new AccountsPage(app);
    mockDeviceEvent = getMockDeviceEvent(app);

    return app.start();
  });

  afterAll(() => {
    return app.stop().then(() => removeUserData());
  });

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
        expect(title).toBe(OnboardingData.appTitle);
      });
  });

  describe("When the app starts", () => {
    it("should load and display an animated logo", async () => {
      await app.client.waitForVisible("#loading-logo");
      expect(await portfolioPage.loadingLogo.isVisible()).toBe(true);
    });

    it("should end loading and animated logo is hidden", async () => {
      await app.client.waitForVisible("#loading-logo", 6000, true);
      expect(await portfolioPage.loadingLogo.isVisible()).toBe(false);
    });
  });

  describe("when app is opened", () => {
    it("should display portfolio container", async () => {
      expect(await portfolioPage.isVisible()).toBe(true);
    });

    it("should display Release note", async () => {
      expect(await modalPage.isVisible()).toBe(true);
      await modalPage.releaseNotesContinueButton.click();
    });

    it("should display Terms of use", async () => {
      expect(await modalPage.isVisible()).toBe(true);
    });

    it("should check checkbox and close terms of use modal", async () => {
      await modalPage.termsCheckbox.click();
      expect(await modalPage.confirmButtonIsEnabled()).toBe(true);
      await modalPage.confirmButton.click();
    });

    it("should display Portfolio empty state", async () => {
      expect(await portfolioPage.isVisible()).toBe(true);
      await app.client.pause(1000);
    });

    it("screenshot Portfolio empty state", async () => {
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "portfolio-1-empty-state",
      });
    });
  });

    // it("shouldn't display experimental flag", async () => {
    //   expect(await portfolioPage.drawerExperimental.waitForVisible(500, true)).toBe(true);
    // });

  describe("When developer mode is Disabled", () => {
    it("should go to add account", async () => {
      await portfolioPage.emptyStateAddAccountButton.click();
      expect(await modalPage.isVisible()).toBe(true);
      expect(await modalPage.title.getText()).toBe(AccountsData.addAccounts.title);
    });

    it("screenshot add account modal empty currency", async () => {
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "add-account-1-currency-field-empty",
      });
    });

    it("should search for bitcoin testnet currency", async () => {
      await modalPage.selectCurrencyInput.setValue("Bitcoin testnet");
      await app.client.keys("Tab");
      expect(await modalPage.selectCurrency.getText()).toBe(
        AccountsData.addAccounts.selectCurrency,
      );
    });

    it("shouldn't find bitcoin testnet currency", async () => {
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "add-account-2-currency-no-result",
      });
      await modalPage.close();
    });
    // TODO: Verify that bitcoin testnet app is not available in Manager
  });

  describe("When user enable developer mode", () => {
    it("should display general settings page", async () => {
      await settingsPage.goToSettings();
      expect(await settingsPage.isVisible()).toBe(true);
      expect(await settingsPage.generalTitle.getText()).toBe(SettingsData.general.title);
      expect(await settingsPage.generalDescription.getText()).toBe(
        SettingsData.general.description,
      );
    });

    it("screenshot General settings page", async () => {
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "settings-1-general",
      });
    });

    it("should display experimental settings page", async () => {
      await settingsPage.goToSettingsExperimental();
      expect(await settingsPage.experimentalFeatureIsVisible()).toBe(true);
      expect(await settingsPage.experimentalTitle.getText()).toBe(SettingsData.experimental.title);
      expect(await settingsPage.experimentalDescription.getText()).toBe(
        SettingsData.experimental.description,
      );
    });

    it("should display experimental flag", async () => {
      await settingsPage.enableDevMode();
      expect(await portfolioPage.drawerExperimental.isVisible()).toBe(true);
    });
  });

  describe("When Developer mode is enabled", () => {
    it("screenshot experimental devmode on", async () => {
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "settings-2-experimental-devmode-on",
      });
    });

    // TODO: Verify that bitcoin testnet app is available in Manager

    it("should go to portfolio", async () => {
      await portfolioPage.drawerPortfolioButton.click();
      expect(await portfolioPage.isVisible()).toBe(true);
    });

    it("should open add account modal", async () => {
      await portfolioPage.emptyStateAddAccountButton.click();
      expect(await modalPage.isVisible()).toBe(true);
      expect(await modalPage.title.getText()).toBe(AccountsData.addAccounts.title);
    });

    it("should find bitcoin testnet currency", async () => {
      await modalPage.selectCurrencyInput.setValue("Bitcoin testnet");
      await app.client.keys("Enter");
      expect(await modalPage.currencyBadge.getText()).toBe("Bitcoin Testnet");
    });

    it("screenshot add-account select currency", async () => {
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "add-account-3-currency-selected",
      });
    });
  });

  describe("When user add bitcoin testnet accounts", () => {
    it("should scan bitcoin testnet accounts", async () => {
      await modalPage.continue();
      await mockDeviceEvent({ type: "opened" });
      await modalPage.addAccountButtonIsEnabled();
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "add-account-4-scan-accounts",
      });
    });

    it("should add bitcoin testnet accounts to portfolio", async () => {
      await modalPage.modalAddAccountsButton.click();
      expect(await modalPage.addAccountsSuccess.getText()).toBe(AccountsData.addAccounts.success);
    });

    it("screenshot add account success modal", async () => {
      await app.client.pause(1500);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "add-account-5-success",
      });
    });

    it("should display portfolio with new accounts", async () => {
      await modalPage.modalAddAccountFinishCloseButton.click();
      expect(await portfolioPage.dashboardGraph.isVisible()).toBe(true);
      expect(await portfolioPage.assetDistribution.isVisible()).toBe(true);
      expect(await portfolioPage.operationsHistoryList.isVisible()).toBe(true);
      await app.client.pause(2000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "portfolio-2-graph",
        failureThreshold: 0.02,
        failureThresholdType: "percent",
      });
    });

    it("should display accounts page", async () => {
      await accountsPage.goToAccounts();
      expect(await accountsPage.accountsPageTitle.getText()).toBe(AccountsData.title);
      expect(await accountsPage.addAccountButton.isVisible()).toBe(true);
      expect(await accountsPage.account.isVisible()).toBe(true);
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "accounts-2-accounts-list",
        failureThreshold: 0.02,
        failureThresholdType: "percent",
      });
    });
  });
});
