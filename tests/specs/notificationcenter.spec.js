import initialize, {
  app,
  notificationsHub,
  portfolioPage,
  mockNewAnnouncement,
  mockNewStatusIncident,
} from "../common.js";
import addAccount from "../flows/accounts/addAccount";

describe("Notification center", () => {
  initialize(
    "notification-center",
    {
      userData: "onboardingcompleted",
    },
    { SPECTRON_DISABLE_MOCK_TIME: true },
  );

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

  describe("When new announcement is pushed", () => {
    afterAll(async () => {
      const closeBtn = await notificationsHub.closeButton();
      await closeBtn.click();
    });

    it("new snackbar element should be displayed", async () => {
      await mockNewAnnouncement();
      const announcementContainer = await portfolioPage.announcementsToast();
      await announcementContainer.waitForDisplayed();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapShotIdentifier: `notification-center-new-portfolio-annoucement`,
      });
    });

    it("user can access notification center from toast", async () => {
      const newAnnoucement = await portfolioPage.newAnnouncement();
      await newAnnoucement.click();
      const notifsHub = await notificationsHub.notificationsDrawer();
      await notifsHub.waitForDisplayed();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapShotIdentifier: `notification-center-new-announcement`,
      });
    });
  });

  describe("When new service disruption", () => {
    const warningBtn = notificationsHub.statusWarningButton();

    it("Warning icon should be present in the topBar", async () => {
      await mockNewStatusIncident();
      await warningBtn.waitForDisplayed();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapShotIdentifier: `notification-center-new-incident-1`,
      });
    });

    it("user can access status center from topbar warning", async () => {
      await warningBtn.click();
      const notifsHub = await notificationsHub.notificationsDrawer();
      await notifsHub.waitForDisplayed();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapShotIdentifier: `notification-center-new-incident-2`,
      });
    });
  });
});
