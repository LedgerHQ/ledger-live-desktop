import initialize, { app, modalPage, settingsPage, userDataPath } from "../../common.js";
const path = require("path");
const fs = require("fs");

function getUserDataFile() {
  const userDataFile = path.resolve(userDataPath, "app.json");
  const jsonFile = fs.readFileSync(userDataFile, "utf-8");
  const userData = JSON.parse(jsonFile);
  return userData;
}

describe("password lock", () => {
  initialize("settings-password-lock", {
    userData: "1AccountBTC1AccountETH",
  });

  it("Open password lock modal", async () => {
    await settingsPage.goToSettings();
    await settingsPage.togglePasswordLock();
    await modalPage.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "settings-general-passwordlock-modal",
    });
  });

  it("Enable password lock", async () => {
    await settingsPage.enablePasswordLock("password", "password");
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "settings-general-passwordlock-enabled",
    });
  });

  it("User data should be encrypted", async () => {
    const userData = await getUserDataFile();
    await app.client.pause(5000);
    expect(typeof userData.data.accounts).toBe("string");
  });

  it("Open change password modal", async () => {
    await settingsPage.openChangePasswordModal();
    await modalPage.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "settings-general-changepassword-modal",
    });
  });

  it("Change password", async () => {
    await settingsPage.writeCurrentPassword("password");
    await settingsPage.enablePasswordLock("newPassword", "newPassword");
    const lockButton = await settingsPage.topbarLockButton();
    expect(lockButton.waitForDisplayed()).toBeTruthy();
  });

  it("Open disable password lock modal", async () => {
    await settingsPage.togglePasswordLock();
    await modalPage.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "settings-general-disablepassword-modal",
    });
  });

  it("Disable password lock", async () => {
    await settingsPage.disablePassword("newPassword");
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "settings-general-passwordlock-disabled",
    });
  });

  it("User data shouldn't be encrypted", async () => {
    const userData = await getUserDataFile();
    await app.client.pause(5000);
    expect(typeof userData.data.accounts).toBe("object");
  });
});
