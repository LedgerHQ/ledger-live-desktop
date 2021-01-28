/* eslint-disable jest/no-export */
import { app, accountsPage, modalPage } from "../../common.js";

const exportAccountsToMobile = (currency = "global") => {
  describe("export accounts to mobile", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
    });

    it("opens the export accounts modal", async () => {
      await accountsPage.exportAccountsToMobile();
      expect(await modalPage.isDisplayed()).toBe(true);
    });

    it("displays a QRCode", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-export-account-to-mobile-modal`,
      });
    });

    it("closes the export accounts modal", async () => {
      await modalPage.confirm();
      expect(await modalPage.isDisplayed(true)).toBe(false);
    });
  });
};

export default exportAccountsToMobile;
