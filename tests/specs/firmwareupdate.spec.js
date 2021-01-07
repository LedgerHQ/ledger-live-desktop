import initialize, { app, deviceInfo, mockListAppsResult, mockDeviceEvent } from "../common.js";

describe("Firmware Update", () => {
  initialize("firmwareupdate", {
    userData: "onboardingcompleted",
  });

  const $ = selector => app.client.$(selector);

  it("access manager", async () => {
    // Access manager and go through firmware update
    const elem = await $("#drawer-manager-button");
    await elem.click();
    await mockDeviceEvent(
      {
        type: "listingApps",
        deviceInfo,
      },
      {
        type: "result",
        result: mockListAppsResult("Bitcoin, Ethereum, Stellar", "Bitcoin", deviceInfo),
      },
      { type: "complete" },
    );
    expect(true).toBeTruthy();
  });

  it("firmware update flow-1", async () => {
    const elem = await $("#manager-update-firmware-button");
    await elem.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-0-manager-page",
    });
  });

  it("firmware update flow-2", async () => {
    const button = await $("#manager-update-firmware-button");
    await button.click();
    const elem = await $("#firmware-update-disclaimer-modal-seed-ready-checkbox");
    await elem.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-1-disclaimer-modal",
    });
  });

  it("firmware update flow-3", async () => {
    const elem = await $("#firmware-update-disclaimer-modal-seed-ready-checkbox");
    await elem.click();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-2-disclaimer-modal-checkbox",
    });
  });

  it("firmware update flow-5", async () => {
    const continueButton = await $("#firmware-update-disclaimer-modal-continue-button");
    await continueButton.click();
    const elem = await $("#firmware-update-download-mcu-title");
    await elem.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-4-download-mcu-modal",
    });
  });

  it("firmware update flow-6", async () => {
    await mockDeviceEvent({}, { type: "complete" }); // .complete() install full firmware -> flash mcu
    const elem = await $("#firmware-update-flash-mcu-title");
    await elem.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-5-flash-mcu-start",
    });
  });

  it("firmware update flow-7", async () => {
    await mockDeviceEvent({}, { type: "complete" }); // .complete() flash mcu -> completed
    const elem = await $("#firmware-update-completed-close-button");
    await elem.waitForDisplayed();
    expect(await app.client.screenshot(6000)).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-6-flash-mcu-done",
    });
  });

  it("firmware update flow-8", async () => {
    const elem = await $("#firmware-update-completed-close-button");
    await elem.click();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-7-close-modal",
    });
  });

  it("firmware update flow-9", async () => {
    const elem = await $("#drawer-dashboard-button");
    await elem.click();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "firmware-update-8-back-to-dashboard",
    });
  });
});
