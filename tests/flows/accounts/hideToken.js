/* eslint-disable jest/no-export */
import { app, accountsPage, accountPage, hideTokenModal } from "../../common.js";

const hideToken = (currency = "global") => {
  describe("hide token account", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
    });

    it("opens an account with tokens", async () => {
      const firstAccountWithTokens = await accountsPage.getFirstAccountWithToken();
      await firstAccountWithTokens.click();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-hide-token-before`,
      });
    });

    it("hides the first token in list", async () => {
      const tokens = await accountPage.getTokens();
      const tokensLength = tokens.length;

      await accountPage.hideFirstToken();

      await hideTokenModal.confirm();
      await hideTokenModal.waitForClosed();

      const newTokens = await accountPage.getTokens();
      expect(newTokens).toHaveLength(tokensLength - 1);
    });

    it("displays a modified tokens list", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-hide-token-after`,
      });
    });
  });
};

export default hideToken;
