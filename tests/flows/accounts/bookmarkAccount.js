/* eslint-disable jest/no-export */
import { app, accountsPage, accountPage } from "../../common.js";

const bookmarkAccount = (currency = "global", startsWithStaredAccounts = false) => {
  describe("bookmark account", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
    });

    if (startsWithStaredAccounts) {
      it("should have at least one bookmarked account", async () => {
        const bookmarkedAccounts = await accountsPage.getBookmarkedAccounts();
        expect(bookmarkedAccounts.length).toBeGreaterThan(0);
      });
    } else {
      it("should not have any bookmarked account", async () => {
        const bookmarkedAccounts = await accountsPage.getBookmarkedAccounts();
        expect(bookmarkedAccounts).toHaveLength(0);
      });
    }

    it("bookmark the first account", async () => {
      let bookmarkedAccounts = await accountsPage.getBookmarkedAccounts();
      const bookmarkedAccountLength = bookmarkedAccounts.length;

      const firstAccountRow = await accountsPage.getFirstAccountRow();
      await accountsPage.clickOnAccountRow(firstAccountRow);

      await accountPage.bookmarkAccount();

      bookmarkedAccounts = await accountsPage.getBookmarkedAccounts();

      expect(bookmarkedAccounts).toHaveLength(bookmarkedAccountLength + 1);
    });

    it("displays a newly bookmarked account in the side menu", async () => {
      if (currency === "xrp") {
        await app.client.waitForSync();
      }
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-bookmark-account`,
      });
    });
  });
};

export default bookmarkAccount;
