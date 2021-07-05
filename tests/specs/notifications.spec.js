import initialize, { portfolioPage, app, addAccountsModal } from "../common.js";

describe("Notifications", () => {
  initialize("notifications", {
    userData: "onboardingcompleted",
  });

  describe("without account", () => {
    it("has zero notifications", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "notifications-no-account-empty-state",
      });
    });

    describe("pushing announcements", () => {
      it("should not show any scoped announcements", async () => {
        await portfolioPage.addAnnouncement();
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "notifications-no-account-empty-state-scoped",
        });
      });

      it("should display one notification for non-scoped announcements", async () => {
        await portfolioPage.addAnnouncement();
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "notifications-no-account-one-notification",
        });
      });
    });

    describe("with one bitcoin account", () => {
      beforeAll(async () => {
        await addAccountsModal.goToAddAccount();
        await addAccountsModal.prepareAddAccount("bitcoin");
        await addAccountsModal.finishAddAccount();
        await addAccountsModal.close();
      });

      it("still should display one", async () => {
        await portfolioPage.addAnnouncement();

        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "notifications-one-account-one-notification",
        });
      });

      it("should display two", async () => {
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "notifications-one-account-two-notifications",
        });
      });
    });

    describe("with one bitcoin and one cosmos account", () => {
      beforeAll(async () => {
        await addAccountsModal.goToAddAccount();
        await addAccountsModal.prepareAddAccount("cosmos");
        await addAccountsModal.finishAddAccount();
        await addAccountsModal.close();
      });

      it("should display scoped notifications", async () => {
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "notifications-two-accounts-three-notifications",
        });
      });
    });
  });
});
