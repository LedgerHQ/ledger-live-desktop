import initialize, {
  app,
  deviceInfo,
  mockListAppsResult,
  mockDeviceEvent,
  onboardingPage,
  modalPage,
  genuinePage,
  passwordPage,
  analyticsPage,
  // portfolioPage,
} from "../common.js";
import data from "../data/onboarding/";

describe("Onboarding", () => {
  initialize({});

  const $ = selector => app.client.$(selector);

  it("go through onboarding-1", async () => {
    const elem = await $("#onboarding-get-started-button");
    await elem.waitForDisplayed({ timeout: 20000 });
    await onboardingPage.getStarted();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-1-get-started",
    });
  });

  it("go through onboarding-2", async () => {
    await onboardingPage.selectConfiguration("new");
    await app.client.pause(500);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-2-screen-new",
    });
  });
  it("go through onboarding-3", async () => {
    await onboardingPage.selectDevice("nanox");
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-3-screen-nano-x",
    });
  });
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
});
