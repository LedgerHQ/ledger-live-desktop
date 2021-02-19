import initialize, {
  app,
  portfolioPage,
  modalPage,
  settingsPage,
  addAccountsModal,
} from "../common.js";
import goToAddAccount from "../flows/accounts/goToAddAccount.js";
import toggleDevMode from "../flows/settings/toggleDevMode.js";
import addAccount from "../flows/accounts/addAccount";

describe("Enable dev mode", () => {
  initialize("settings-dev-mode", {
    userData: "onboardingcompleted",
  });

  const currencies = ["bitcoin testnet", "ethereum ropsten", "cosmos testnet"];

  it("testnet currencies should not be available in Add account flow", async () => {
    await goToAddAccount();
    for (const currency of currencies) {
      await addAccountsModal.prepareAddAccount(currency);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `addAccount-${currency}-no-results`,
      });
    }
  });

  it("enable dev mode", async () => {
    const closeBtn = await modalPage.closeButton;
    await closeBtn.click();
    await toggleDevMode();
    await settingsPage.goToPortfolio();
    const emptyStateTitle = await portfolioPage.portfolioEmptyStateTitle;
    expect(await emptyStateTitle.getText()).toBe("Add an account to get started");
  });
  for (const currency of currencies) {
    addAccount(currency);
  }
});
