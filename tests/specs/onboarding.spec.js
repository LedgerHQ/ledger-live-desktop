import initialize, {
  app,
  deviceInfo,
  mockListAppsResult,
  mockDeviceEvent,
  // portfolioPage,
} from "../common.js";

describe("Onboarding", () => {
  initialize("onboarding", {});

  const $ = selector => app.client.$(selector);

  it("go through start", async () => {
    const elem = await $("#onboarding-get-started-button");
    await elem.click();
    await $("#modal-container");
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-terms",
    });
  });
  it("accept terms", async () => {
    const lossCB = await $("#modal-terms-checkbox-loss");
    const termCB = await $("#modal-terms-checkbox");
    const cta = await $("#modal-confirm-button");
    await lossCB.click();
    await termCB.click();
    await cta.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-terms-accepted",
    });
  });
  it("selects nanoX", async () => {
    const nanoX = await $("#device-nanoX");
    await nanoX.click();
    await app.client.pause(500);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-nanoX-flow",
    });
  });
  /*
  it("go through onboarding-4", async () => {
    await onboardingPage.continue();
    await onboardingPage.continue();
    await onboardingPage.continue();
    await genuinePage.checkPin(true);
    await genuinePage.checkSeed(true);
    await genuinePage.check();
    await modalPage.close();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.selectConfiguration("restore");
    await onboardingPage.selectDevice("blue");
    await onboardingPage.continue();
    await onboardingPage.continue();
    await onboardingPage.continue();
    await genuinePage.checkPin(true);
    await genuinePage.checkSeed(true);
    await genuinePage.check();
    await modalPage.close();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.back();
    await onboardingPage.selectConfiguration("nodevice");
    await onboardingPage.back();
    await onboardingPage.selectConfiguration("initialized");
    await onboardingPage.selectDevice("nanos");
    await onboardingPage.continue();
    await genuinePage.checkPin(false);
    await onboardingPage.back();
    await genuinePage.checkPin(true);
    await genuinePage.checkSeed(false);
    await onboardingPage.back();
    await genuinePage.checkPin(true);
    await genuinePage.checkSeed(true);
    await genuinePage.check();
    await mockDeviceEvent(
      {
        type: "listingApps",
        deviceInfo,
      },
      {
        type: "result",
        result: mockListAppsResult("Bitcoin", "Bitcoin", deviceInfo),
      },
      { type: "complete" },
    );
    await app.client.pause(2000);
    const onboardingContinueButton = await $("#onboarding-continue-button");
    await onboardingContinueButton.waitForDisplayed();
    await onboardingPage.continue();
    await passwordPage.skip();
    const analyticsDataFakeLinkElem = await analyticsPage.dataFakeLink;
    await analyticsDataFakeLinkElem.click();
    await modalPage.close();
    const analyticsShareFakeLinkElem = await analyticsPage.shareFakeLink;
    await analyticsShareFakeLinkElem.click();
    await modalPage.close();
    const analyticsShareSwitch = await analyticsPage.shareSwitch;
    await analyticsShareSwitch.click();
    await analyticsShareSwitch.click();
    const analyticsLogsSwitch = await analyticsPage.logsSwitch;
    await analyticsLogsSwitch.click();
    await analyticsLogsSwitch.click();
    await onboardingPage.continue();
    await onboardingPage.open();
    await modalPage.isDisplayed();
    const modalTermsCheckbox = await modalPage.termsCheckbox;
    await modalTermsCheckbox.click();
    const modalConfirmButton = await $("#modal-confirm-button");
    await modalConfirmButton.waitForEnabled();
    await modalPage.confirm();

    expect(await modalPage.isDisplayed(true)).toBe(false);
  });
  */
});
