import initialize, { app, mockListAppsResult, mockDeviceEvent, managerPage } from "../common.js";

describe("Manager", () => {
  initialize("manager", {
    userData: "onboardingcompleted",
  });

  const deviceInfo = {
    version: "2.0.0",
    isBootloader: false,
    isOSU: false,
    managerAllowed: false,
    mcuVersion: "1.12",
    pinValidated: false,
    providerName: null,
    majMin: "2.0",
    targetId: 823132164,
  };

  it("can access manager", async () => {
    await managerPage.goToManager();
    await mockDeviceEvent(
      {
        type: "listingApps",
        deviceInfo,
      },
      {
        type: "result",
        result: mockListAppsResult(
          "Bitcoin,Ethereum,Litecoin,Stellar,Tron,Ripple,Polkadot",
          "Bitcoin,Ethereum (outdated)",
          deviceInfo,
        ),
      },
      { type: "complete" },
    );
    await app.client.pause(4000);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "manager-catalog",
    });
  });

  it("can install an app", async () => {
    await managerPage.installApp("Tron");
    await app.client.pause(3000);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "manager-install-tron",
    });
  });

  it("can access installed apps tab", async () => {
    await managerPage.goToInstalledAppTab();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "manager-appsOnDevice",
    });
  });

  it("can uninstall an app", async () => {
    await managerPage.uninstallApp("Tron");
    await app.client.pause(3000);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "manager-uninstall-tron",
    });
  });

  it("can update all apps", async () => {
    await managerPage.goToCatalogTab();
    await managerPage.updateAllApps();
    await app.client.pause(3000);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "manager-updateAll",
    });
  });
});
