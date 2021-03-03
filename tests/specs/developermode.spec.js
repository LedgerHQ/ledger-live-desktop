import initialize, {
  app,
  portfolioPage,
  modalPage,
  settingsPage,
  addAccountsModal,
} from "../common.js";
import addAccount from "../flows/accounts/addAccount";

describe("Enable dev mode", () => {
  initialize("settings-dev-mode", {
    userData: "onboardingcompleted",
  });

  const currencies = ["bitcoin_testnet", "ethereum_ropsten", "MUON"];

  describe("with dev mode = false", () => {
    afterEach(async () => {
      const closeBtn = await modalPage.closeButton();
      await closeBtn.click();
    });
    for (const currency of currencies) {
      it(`${currency} should not be available in Add account flow`, async () => {
        await addAccountsModal.goToAddAccount();
        await addAccountsModal.prepareAddAccount(currency);
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: `addAccount-${currency}-no-results`,
        });
      });
    }
  });

  describe("with dev mode = true", () => {
    beforeAll(async () => {
      await settingsPage.toggleDevMode();
      await settingsPage.goToPortfolio();
    });

    it("portfolio should be empty", async () => {
      const experimentalFlag = await portfolioPage.drawerExperimentalButton();
      expect(await experimentalFlag.getText()).toBe("Experimental");
    });

    for (const currency of currencies) {
      addAccount(currency);
    }
  });
});
