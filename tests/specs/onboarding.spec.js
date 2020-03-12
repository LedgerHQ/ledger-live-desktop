import { applicationProxy } from "../applicationProxy";
import OnboardingPage from "../po/onboarding.page";
import ModalPage from "../po/modal.page";
import onboardingData from "../data/onboarding/";

describe("When I launch the app for the first time", () => {
  let app;
  let onboardingPage;
  let modalPage;

  jest.setTimeout(10000);

  beforeAll(async () => {
    app = applicationProxy();
    await app.start();
    onboardingPage = new OnboardingPage(app);
    modalPage = new ModalPage(app);
  });

  afterAll(async () => {
    await app.stop();
  });

  it("opens a window", () => {
    return app.client
      .waitUntilWindowLoaded()
      .getTitle()
      .then(title => {
        expect(title).toBe(onboardingData.appTitle);
      });
  });

  it("should be able to change theme", async () => {
    expect(await onboardingPage.isVisible()).toBe(true);
    expect(await onboardingPage.logo.isVisible()).toBe(true);
    expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.welcomeTitle);
    expect(await onboardingPage.pageDescription.getText()).toBe(onboardingData.welcomeDesc);

    await onboardingPage.setTheme("dusk");
    expect(await onboardingPage.getThemeColor()).toBe(onboardingData.duskColor);
    await onboardingPage.setTheme("dark");
    expect(await onboardingPage.getThemeColor()).toBe(onboardingData.darkColor);
    await onboardingPage.setTheme("light");
    expect(await onboardingPage.getThemeColor()).toBe(onboardingData.lightColor);
  });

  describe("When I start the onboarding", () => {
    it("should display different options", async () => {
      await onboardingPage.getStarted();
      expect(await onboardingPage.logo.isVisible()).toBe(true);
      expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.getStartedTitle);
      expect(await onboardingPage.newDeviceButton.isVisible()).toBe(true);
      expect(await onboardingPage.restoreDeviceButton.isVisible()).toBe(true);
      expect(await onboardingPage.initializedDeviceButton.isVisible()).toBe(true);
      expect(await onboardingPage.noDeviceButton.isVisible()).toBe(true);
    });

    describe("Setup new device flow", () => {
      it("should allow to setup new device (nanoX)", async () => {
        await onboardingPage.selectConfiguration("new");
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.selectDeviceTitle);
        expect(await onboardingPage.nanoX.isVisible()).toBe(true);
        expect(await onboardingPage.nanoS.isVisible()).toBe(true);
        expect(await onboardingPage.blue.isVisible()).toBe(true);
        await onboardingPage.selectDevice("nanox");
        await onboardingPage.continue();
      });

      it("should help user to setup a new device", async () => {
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.choosePinTitle);
        await onboardingPage.continue();
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.saveSeedTitle);
        await onboardingPage.continue();
      });

      it("should ask to fill a security checklist", async () => {
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.securityTitle);
        expect(await onboardingPage.pageDescription.getText()).toBe(onboardingData.securityDesc2);
        await onboardingPage.genuineCheckPin("yes");
        await onboardingPage.genuineCheckSeed("yes");
        await onboardingPage.genuineCheck();
      });

      it("should display a modal to perform a genuine check", async () => {
        expect(await modalPage.isVisible()).toBe(true);
        expect(await modalPage.title.getText()).toBe(onboardingData.genuineModalTitle);
        await modalPage.closeButton.click();
      });

      it("should be able to browse to previous steps", async () => {
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.saveSeedTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.choosePinTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.selectDeviceTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.getStartedTitle);
      });
    });

    describe("Restore device flow", () => {
      it("should allow to restore a device (blue)", async () => {
        await onboardingPage.selectConfiguration("restore");
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.selectDeviceTitle);
        expect(await onboardingPage.nanoX.isVisible()).toBe(true);
        expect(await onboardingPage.nanoS.isVisible()).toBe(true);
        expect(await onboardingPage.blue.isVisible()).toBe(true);
        await onboardingPage.selectDevice("blue");
        await onboardingPage.continue();
      });

      it("should help user to restore a device", async () => {
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.choosePinTitle);
        await onboardingPage.continue();
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.enterSeedTitle);
        await onboardingPage.continue();
      });

      it("should ask to fill a security checklist", async () => {
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.securityTitle);
        expect(await onboardingPage.pageDescription.getText()).toBe(onboardingData.securityDesc);
        await onboardingPage.genuineCheckPin("yes");
        await onboardingPage.genuineCheckSeed("yes");
        await onboardingPage.genuineCheck();
      });

      it("should display a modal to perform a genuine check", async () => {
        expect(await modalPage.isVisible()).toBe(true);
        expect(await modalPage.title.getText()).toBe(onboardingData.genuineModalTitle);
        await modalPage.closeButton.click();
      });

      it("should be able to browse to previous steps", async () => {
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.enterSeedTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.choosePinTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.selectDeviceTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.getStartedTitle);
      });
    });

    describe("Initialized device flow", () => {
      it("should allow to use an initialized device (nanoS)", async () => {
        await onboardingPage.selectConfiguration("initialized");
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.selectDeviceTitle);
        expect(await onboardingPage.nanoX.isVisible()).toBe(true);
        expect(await onboardingPage.nanoS.isVisible()).toBe(true);
        expect(await onboardingPage.blue.isVisible()).toBe(true);
        await onboardingPage.selectDevice("nanos");
        await onboardingPage.continue();
      });

      describe("When it ask to fill a security checklist", () => {
        it("should fail if PIN not choosen by user", async () => {
          expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.securityTitle);
          await onboardingPage.genuineCheckPin("no");
          expect(await onboardingPage.pageTitle.getText()).toBe(
            onboardingData.genuinePinErrorTitle,
          );
          expect(await onboardingPage.pageDescription.getText()).toBe(
            onboardingData.genuinePinErrorDesc,
          );
          expect(await onboardingPage.contactUsButton.isVisible()).toBe(true);
          await onboardingPage.back();
        });

        it("should fail if SEED not choosen by user", async () => {
          await onboardingPage.genuineCheckPin("yes");
          await onboardingPage.genuineCheckSeed("no");
          expect(await onboardingPage.pageTitle.getText()).toBe(
            onboardingData.genuineSeedErrorTitle,
          );
          expect(await onboardingPage.pageDescription.getText()).toBe(
            onboardingData.genuineSeedErrorDesc,
          );
          expect(await onboardingPage.contactUsButton.isVisible()).toBe(true);
          await onboardingPage.back();
        });

        it("should success if all requirements have been met", async () => {
          expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.securityTitle);
          await onboardingPage.genuineCheckPin("yes");
          await onboardingPage.genuineCheckSeed("yes");
          await onboardingPage.genuineCheck();
        });

        it("should display a modal to perform a genuine check", async () => {
          expect(await modalPage.isVisible()).toBe(true);
          expect(await modalPage.title.getText()).toBe(onboardingData.genuineModalTitle);
          await modalPage.closeButton.click();
        });

        it("should be able to browse to previous steps", async () => {
          await onboardingPage.back();
          expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.selectDeviceTitle);
          await onboardingPage.back();
          expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.getStartedTitle);
        });
      });
    });

    describe("No device flow", () => {
      it("should display a menu", async () => {
        await onboardingPage.selectConfiguration("nodevice");
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.noDeviceTitle);
        expect(await onboardingPage.buyNewButton.isVisible()).toBe(true);
        expect(await onboardingPage.trackOrderButton.isVisible()).toBe(true);
        expect(await onboardingPage.learnMoreButton.isVisible()).toBe(true);
      });

      it("should be able to browse to previous steps", async () => {
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(onboardingData.getStartedTitle);
      });
    });
  });
});
