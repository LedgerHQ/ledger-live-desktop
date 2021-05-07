import Page from "./page";

export default class NotificationsHub extends Page {
  async notificationsButton() {
    return this.$("#topbar-notification-button");
  }

  async statusWarningButton() {
    return this.$("#topbar-service-status-button");
  }

  async notificationsBadge() {
    return this.$("#notifications-badge");
  }

  async notificationsDrawer() {
    return this.$("#notification-drawer");
  }

  async announcementTab() {
    return this.$("#announcement-tab");
  }

  async statusTab() {
    return this.$("#status-tab");
  }

  async closeButton() {
    return this.$("#close-notifications-button");
  }

  async openNotificationsHub() {
    const notificationBtn = await this.notificationsButton();
    await notificationBtn.click();
    const notificationDrawer = await this.notificationsDrawer();
    await notificationDrawer.waitForDisplayed();
  }
}
