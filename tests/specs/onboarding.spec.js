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
    await $("#terms-markdown");
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

  it("goes through the tutorial", async () => {
    const firstUse = await $("#first-use");
    await firstUse.click();
    const right = await $("#pedagogy-right");
    await right.click();
    await right.click();
    await right.click();
    await right.click();
    const cta = await $("#setup-nano-wallet-cta");
    await cta.click();
    await app.client.pause(500);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-nano-getstarted",
    });
  });

  it("gets started", async () => {
    const next = await $("#get-started-cta");
    await next.click();
    const carefulcta = await $("#be-careful-cta");
    carefulcta.click();
    await app.client.pause(500);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-nano-getstarted-2",
    });
  });

  it("goest to pincode", async () => {
    const next = await $("#device-howto-cta");
    await next.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-nano-pincode",
    });
  });

  it("goest to pincode 2", async () => {
    const pincodeCB = await $("#pincode-private-cb");
    pincodeCB.click();
    const next = await $("#device-pincode-cta");
    await next.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-nano-pincode-2",
    });
  });

  it("goest to recovery phrase", async () => {
    const next = await $("#pincode-howto-cta");
    await next.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-nano-recoveryphrase",
    });
  });

  it("goest to recovery phrase 2", async () => {
    const recoveryphraseCB = await $("#recoveryphrase-private-cb");
    recoveryphraseCB.click();
    const next = await $("#device-recoveryphrase-cta");
    await next.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-nano-recoveryphrase-2",
    });
  });

  it("goest to recovery phrase 3", async () => {
    const next = await $("#use-recovery-sheet");
    await next.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-nano-recoveryphrase-3",
    });
  });

  it("goest to recovery phrase 4", async () => {
    const next = await $("#recovery-howto-3");
    await next.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-nano-recoveryphrase-4",
    });
  });

  it("goest to quizz", async () => {
    const next = await $("#hide-recovery-cta");
    await next.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-nano-quizz",
    });
  });

  it("finished the quizz", async () => {
    let next = await $("#quizz-start-cta");
    await next.click();
    next = await $("#answer-1");
    await next.click();
    next = await $("#quizz-next-cta");
    await next.click();
    next = await $("#answer-1");
    await next.click();
    next = await $("#quizz-next-cta");
    await next.click();
    next = await $("#answer-0");
    await next.click();
    next = await $("#quizz-next-cta");
    await next.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-you-are-a-pro",
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
