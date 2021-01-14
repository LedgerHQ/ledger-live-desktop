import initialize, { app, deviceInfo, mockListAppsResult, mockDeviceEvent } from "../common.js";

const $ = selector => app.client.$(selector);

const nanoXSelection = () => {
  it("go through start", async () => {
    const elem = await $("#onboarding-get-started-button");
    await elem.click();
    const terms = await $("#modal-confirm-button");
    await terms.waitForDisplayed();
    await app.client.pause(2000);
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
};

const goToConnectAndFinish = cta => {
  it("goest to connect", async () => {
    const next = await $(cta);
    await next.click();
    await app.client.pause(500);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      // wave thing
      failureThreshold: 15,
      failureThresholdType: "pixel",
      // its the same but for some reason theres a button that's not the same (?)
      customSnapshotIdentifier: "onboarding-genuine-check-" + cta.replace("#", ""),
    });
  });

  it("check nano", async () => {
    const next = await $("#pair-my-nano-cta");
    await next.click();
    await app.client.pause(200);
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
    await app.client.pause(5000);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      // wave thing
      failureThreshold: 15,
      failureThresholdType: "pixel",
      customSnapshotIdentifier: "onboarding-check-complete-" + cta.replace("#", ""),
    });
  });

  it("should be on app", async () => {
    const next = await $("#genuine-check-cta");
    await next.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-complete",
    });
  });
};

describe("Onboarding", () => {
  describe("onboarding nano x - new nano", () => {
    initialize("onboarding", {});

    nanoXSelection();

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
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
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
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-getstarted-2",
      });
    });

    it("goest to pincode", async () => {
      const next = await $("#device-howto-cta");
      await next.click();
      await app.client.pause(200);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
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
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-pincode-2",
      });
    });

    it("goest to recovery phrase", async () => {
      const next = await $("#pincode-howto-cta");
      await next.click();
      await app.client.pause(200);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
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
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-2",
      });
    });

    it("goest to recovery phrase 3", async () => {
      const next = await $("#use-recovery-sheet");
      await next.click();
      await app.client.pause(200);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-3",
      });
    });

    it("goest to recovery phrase 4", async () => {
      const next = await $("#recovery-howto-3");
      await next.click();
      await app.client.pause(200);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-4",
      });
    });

    it("goest to quizz", async () => {
      const next = await $("#hide-recovery-cta");
      await next.click();
      await app.client.pause(200);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
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
      await app.client.pause(400);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-you-are-a-pro",
      });
    });

    goToConnectAndFinish("#quizz-success-cta");
  });

  describe("onboarding nano x - connect", () => {
    initialize("onboarding", {});

    nanoXSelection();

    goToConnectAndFinish("#initialized-device");
  });

  describe("onboarding nano x - restore", () => {
    initialize("onboarding", {});

    nanoXSelection();

    it("goes to restore 1", async () => {
      const next = await $("#restore-device");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-restore-start",
      });
    });

    it("warns the user", async () => {
      const next = await $("#import-recovery-next");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-restore-warn",
      });
    });

    it("does recovery 1", async () => {
      const next = await $("#ledger-seed-warn");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-restore-step1",
      });
    });

    it("goest to pincode", async () => {
      const next = await $("#device-howto-2");
      await next.click();
      await app.client.pause(200);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-restore-pincode",
      });
    });

    it("goest to pincode 2", async () => {
      const pincodeCB = await $("#pincode-private-cb");
      pincodeCB.click();
      const next = await $("#device-pincode-cta");
      await next.click();
      await app.client.pause(200);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-restore-pincode-2",
      });
    });

    it("goest to recovery phrase restore", async () => {
      const next = await $("#pincode-howto-cta");
      await next.click();
      await app.client.pause(200);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-restore",
      });
    });

    it("goest to recovery phrase restore 2", async () => {
      const recoveryphraseCB = await $("#passphrase-recovery-cb");
      recoveryphraseCB.click();
      const next = await $("#passphrase-recovery-cta");
      await next.click();
      await app.client.pause(200);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-restore-2",
      });
    });

    it("goest to recovery phrase restore 3", async () => {
      const next = await $("#recovery-howto-1");
      await next.click();
      await app.client.pause(200);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-restore-3",
      });
    });

    goToConnectAndFinish("#recovery-howto-2");
  });
});
