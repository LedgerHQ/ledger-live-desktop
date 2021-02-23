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

  const currencies = ["bitcoin_testnet", "ethereum_ropsten", "MUON"];

  describe("with dev mode = false", () => {
    for (const currency of currencies) {
      it(`${currency} should not be available in Add account flow`, async () => {
        await goToAddAccount();
        await addAccountsModal.prepareAddAccount(currency);
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: `addAccount-${currency}-no-results`,
        });
      });
    }
  });

  describe("with dev mode = true", () => {
    beforeAll(async () => {
      const closeBtn = await modalPage.closeButton();
      await closeBtn.click();
      await toggleDevMode();
      await settingsPage.goToPortfolio();
    });

    it("portfolio should be empty", async () => {
      const emptyStateTitle = await portfolioPage.portfolioEmptyStateTitle();
      expect(await emptyStateTitle.getText()).toBe("Add an account to get started");
    });

    for (const currency of currencies) {
      addAccount(currency);
    }
  });
});
