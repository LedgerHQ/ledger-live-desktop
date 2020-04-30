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
    it("should display Portfolio", async () => {
      expect(await portfolioPage.isVisible()).toBe(true);
    });

    it("should display Release note", async () => {
      expect(await portfolioPage.isVisible()).toBe(true);
      expect(await modalPage.isVisible()).toBe(true);
      await modalPage.releaseNotesContinueButton.click();
    });

    it("should display Terms of use", async () => {
      expect(await modalPage.isVisible()).toBe(true);
      await modalPage.termsCheckbox.click();
      expect(await modalPage.isEnabled()).toBe(true);
      await modalPage.confirmButton.click();
    });

    it("should display Portfolio empty state", async () => {
      expect(await portfolioPage.isVisible()).toBe(true);
      expect(await portfolioPage.emptyStateTitle.getText()).toBe(PortfolioData.emptyState.title);
      expect(await portfolioPage.emptyStateDesc.getText()).toBe(
        PortfolioData.emptyState.description,
      );
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "portfolio-1-empty-state",
      });
    });

    // it("shouldn't display experimental flag", async () => {
    //   expect(await portfolioPage.drawerExperimental.waitForVisible(500, true)).toBe(true);
    // });

    /*    it("shouldn't be able to find testnet apps in the manager", async () => {
      await portfolioPage.emptyStateManagerButton.click();
      await mockDeviceEvent(
        {
          type: "listingApps",
          deviceInfo,
        },
        {
          type: "result",
          result: mockListAppsResult(
            "Bitcoin, Bitcoin Testnet, Ethereum, Stellar, Tezos",
            "Bitcoin, Ethereum",
            deviceInfo,
          ),
        },
        { type: "complete" },
      );
      expect(await managerPage.isVisible()).toBe(true);
      await managerPage.appsListContainer.waitForDisplayed();
      expect(await managerPage.appsListContainer.isVisible()).toBe(true);
      expect(await managerPage.managerAppsSearchInput.getAttribute("placeholder")).toBe(
        ManagerData.searchInputPlaceholder,
      );
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "manager-1-apps-list",
      });
      await managerPage.managerAppsSearchInput.setValue("bitcoin testnet");
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "manager-2-search-result",
      });
    });
    */

    it("shouldn't be able to add bitcoin testnet accounts", async () => {
      await portfolioPage.drawerPortfolioButton.click();
      expect(await portfolioPage.isVisible()).toBe(true);
      await portfolioPage.emptyStateAddAccountButton.click();
      expect(await modalPage.isVisible()).toBe(true);
      expect(await modalPage.title.getText()).toBe(AccountsData.addAccounts.title);
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "add-account-1-currency-field-empty",
      });
      await modalPage.selectCurrencyInput.setValue("Bitcoin testnet");
      await app.client.keys("Tab");
      expect(await modalPage.selectCurrency.getText()).toBe(
        AccountsData.addAccounts.selectCurrency,
      );
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "add-account-2-currency-no-result",
      });
      await modalPage.close();
    });
  });

  describe("When user go to Settings -> Experimental features", () => {
    it("should display general settings page", async () => {
      await settingsPage.goToSettings();
      expect(await settingsPage.isVisible()).toBe(true);
      expect(await settingsPage.generalTitle.getText()).toBe(SettingsData.general.title);
      expect(await settingsPage.generalDescription.getText()).toBe(
        SettingsData.general.description,
      );
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "settings-1-general",
      });
    });

    it("should display experimental settings page", async () => {
      await settingsPage.goToSettingsExperimental();
      await app.client.pause(1000);
      expect(await settingsPage.experimentalTitle.getText()).toBe(SettingsData.experimental.title);
      expect(await settingsPage.experimentalDescription.getText()).toBe(
        SettingsData.experimental.description,
      );
    });
  });

  describe("When user enable Developer mode", () => {
    it("should display experimental flag", async () => {
      await settingsPage.enableDevMode();
      expect(await portfolioPage.drawerExperimental.isVisible()).toBe(true);
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "settings-3-experimental-devmode-on",
      });
    });

    it("should be able to find bitcoin testnet app in Manager", async () => {
      await portfolioPage.drawerManagerButton.click();
      await mockDeviceEvent(
        {
          type: "listingApps",
          deviceInfo,
        },
        {
          type: "result",
          result: mockListAppsResult(
            "Bitcoin, Bitcoin Testnet, Ethereum, Stellar, Tezos",
            "Bitcoin, Ethereum",
            deviceInfo,
          ),
        },
        { type: "complete" },
      );
      expect(await managerPage.isVisible()).toBe(true);
      expect(await managerPage.appsListContainer.isVisible()).toBe(true);
      expect(await managerPage.managerAppsSearchInput.getAttribute("placeholder")).toBe(
        ManagerData.searchInputPlaceholder,
      );
      await managerPage.managerAppsSearchInput.setValue("bitcoin testnet");
      expect(await managerPage.managerAppName.getText()).toBe("Bitcoin Testnet");
    });

    // TODO: install app from manager

    it("should find bitcoin testnet in add account", async () => {
      await portfolioPage.drawerPortfolioButton.click();
      expect(await portfolioPage.isVisible()).toBe(true);
      await portfolioPage.emptyStateAddAccountButton.click();
      expect(await modalPage.isVisible()).toBe(true);
      expect(await modalPage.title.getText()).toBe(AccountsData.addAccounts.title);

      await modalPage.selectCurrencyInput.setValue("Bitcoin testnet");
      await app.client.keys("Enter");
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "add-account-3-currency-selected",
      });
      expect(await modalPage.currencyBadge.getText()).toBe("Bitcoin Testnet");
    });

    it("should add bitcoin testnet accounts", async () => {
      await modalPage.continue();
      await mockDeviceEvent({ type: "opened" });
      await modalPage.modalAddAccountsButton.waitForEnabled(10000);
      await app.client.pause(1000);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "add-account-4-scan-accounts",
      });
      await modalPage.modalAddAccountsButton.click();
      expect(await modalPage.addAccountsSuccess.getText()).toBe(AccountsData.addAccount.success);
      await app.client.pause(1500);
      image = await app.browserWindow.capturePage();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: "add-account-5-success",
      });
      await modalPage.modalAddAccountFinishCloseButton.click();
    });

    it("should display portfolio with new accounts", async () => {
      await app.client.pause(1000);
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
