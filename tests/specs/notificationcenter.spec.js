import initialize, {
  app,
  notificationsHub,
  mockNewAnnouncement,
  mockNewStatusIncident,
} from "../common.js";
import addAccount from "../flows/accounts/addAccount";

describe("Notification center", () => {
  initialize("notification-center", {
    userData: "onboardingcompleted",
  });

  describe("When LL empty state", () => {
    afterAll(async () => {
      const closeBtn = await notificationsHub.closeButton();
      await closeBtn.click();
    });
    it("general announcement should be displayed", async () => {
      await notificationsHub.openNotificationsHub();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapShotIdentifier: `notification-center-announcements-empty-state`,
      });
    });

    it("status should be empty", async () => {
      const statusTab = await notificationsHub.statusTab();
      await statusTab.click();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapShotIdentifier: `notification-center-status-empty-state`,
      });
    });
  });

  describe("When user add accounts", () => {
    addAccount("bitcoin");
    it("specific annoucement should be displayed", async () => {
      const notificationsBadge = await notificationsHub.notificationsBadge();
      await notificationsBadge.waitForDisplayed({ timeout: 60000 });
      await notificationsHub.openNotificationsHub();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapShotIdentifier: `notification-center-after-addAccounts`,
      });
    });
  });
});
