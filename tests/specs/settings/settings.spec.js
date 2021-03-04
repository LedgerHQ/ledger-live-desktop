import initialize, { app, settingsPage } from "../../common.js";

describe("Settings", () => {
  initialize("settings", {
    userData: "onboardingcompleted",
  });

  it("go to settings", async () => {
    // Open settings and navigate all tabs
    await settingsPage.goToSettings();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "settings-general",
    });
  });

  it("go to settings -> accounts", async () => {
    await settingsPage.goToAccountsTab();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "settings-accounts",
    });
  });

  it("go to settings -> about", async () => {
    await settingsPage.goToAboutTab();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "settings-about",
    });
  });

  it("go to settings -> help", async () => {
    await settingsPage.goToHelpTab();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "settings-help",
    });
  });

  it("go to settings -> experimental", async () => {
    await settingsPage.goToExperimentalTab();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "settings-experiemntal",
    });
  });
});
