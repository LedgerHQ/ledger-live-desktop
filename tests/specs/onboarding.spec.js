import { applicationProxy, getMockDeviceEvent } from "../applicationProxy";
import OnboardingPage from "../po/onboarding.page";
import ModalPage from "../po/modal.page";
import GenuinePage from "../po/genuine.page";
import PasswordPage from "../po/password.page";
import AnalyticsPage from "../po/analytics.page";
import PortfolioPage from "../po/portfolio.page";
import LockPage from "../po/lock.page";
import data from "../data/onboarding/";
import { deviceInfo155, mockListAppsResult } from "@ledgerhq/live-common/lib/apps/mock";

jest.setTimeout(60000);

describe("When I launch the app for the first time", () => {
  let app;
  let onboardingPage;
  let modalPage;
  let genuinePage;
  let passwordPage;
  let analyticsPage;
  let portfolioPage;
  let lockPage;
  let mockDeviceEvent;

  beforeAll(() => {
    app = applicationProxy({ MOCK: true });
    onboardingPage = new OnboardingPage(app);
    modalPage = new ModalPage(app);
    genuinePage = new GenuinePage(app);
    passwordPage = new PasswordPage(app);
    analyticsPage = new AnalyticsPage(app);
    portfolioPage = new PortfolioPage(app);
    lockPage = new LockPage(app);
    mockDeviceEvent = getMockDeviceEvent(app);

    return app.start();
  });

  afterAll(() => {
    return app.stop();
  });

  it("opens a window", () => {
    return app.client
      .waitUntilWindowLoaded()
      .getWindowCount()
      .then(count => expect(count).toBe(1))
      .browserWindow.isMinimized()
      .then(minimized => expect(minimized).toBe(false))
      .browserWindow.isVisible()
      .then(visible => expect(visible).toBe(true))
      .browserWindow.isFocused()
      .then(focused => expect(focused).toBe(true))
      .getTitle()
      .then(title => {
        expect(title).toBe(data.appTitle);
      });
  });

  describe("When the app starts", () => {
    it("should load and display an animated logo", async () => {
      await app.client.waitForVisible("#loading-logo");
      expect(await onboardingPage.loadingLogo.isVisible()).toBe(true);
    });

    it("should end loading and animated logo is hidden", async () => {
      await app.client.waitForVisible("#loading-logo", 5000, true);
      expect(await onboardingPage.loadingLogo.isVisible()).toBe(false);
    });
  });

  describe("When it displays the welcome page", () => {
    it("should propose to change the theme", async () => {
      expect(await onboardingPage.isVisible()).toBe(true);
      expect(await onboardingPage.logo.isVisible()).toBe(true);
      expect(await onboardingPage.pageTitle.getText()).toBe(data.welcome.title);
      expect(await onboardingPage.pageDescription.getText()).toBe(data.welcome.description);
    });

    describe("When I change the theme", () => {
      it("should change the appearance to dusk", async () => {
        await onboardingPage.setTheme("dusk");
        expect(await onboardingPage.getThemeColor()).toBe(data.duskColor);
      });

      it("should change the appearance to dark", async () => {
        await onboardingPage.setTheme("dark");
        expect(await onboardingPage.getThemeColor()).toBe(data.darkColor);
      });

      it("should change the appearance to light", async () => {
        await onboardingPage.setTheme("light");
        expect(await onboardingPage.getThemeColor()).toBe(data.lightColor);
      });
    });
  });

  describe("When I start the onboarding", () => {
    it("should display different options", async () => {
      await onboardingPage.getStarted();
      expect(await onboardingPage.logo.isVisible()).toBe(true);
      expect(await onboardingPage.pageTitle.getText()).toBe(data.getStartedTitle);
      expect(await onboardingPage.newDeviceButton.isVisible()).toBe(true);
      expect(await onboardingPage.restoreDeviceButton.isVisible()).toBe(true);
      expect(await onboardingPage.initializedDeviceButton.isVisible()).toBe(true);
      expect(await onboardingPage.noDeviceButton.isVisible()).toBe(true);
    });

    describe("When I start 'Setup new device' flow", () => {
      it("should allow to setup new device (nanoX)", async () => {
        await onboardingPage.selectConfiguration("new");
        expect(await onboardingPage.pageTitle.getText()).toBe(data.selectDeviceTitle);
        expect(await onboardingPage.nanoX.isVisible()).toBe(true);
        expect(await onboardingPage.nanoS.isVisible()).toBe(true);
        expect(await onboardingPage.blue.isVisible()).toBe(true);
        await onboardingPage.selectDevice("nanox");
        await onboardingPage.continue();
      });

      it("should help user to setup a new device", async () => {
        expect(await onboardingPage.pageTitle.getText()).toBe(data.choosePinTitle);
        await onboardingPage.continue();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.saveSeedTitle);
        await onboardingPage.continue();
      });

      it("should ask to fill a security checklist", async () => {
        expect(await onboardingPage.pageTitle.getText()).toBe(data.genuine.title);
        expect(await onboardingPage.pageDescription.getText()).toBe(data.genuine.description2);
        await genuinePage.checkPin(true);
        await genuinePage.checkSeed(true);
        await genuinePage.check();
      });

      it("should display a modal to perform a genuine check", async () => {
        expect(await modalPage.isVisible()).toBe(true);
        expect(await modalPage.title.getText()).toBe(data.genuine.modalTitle);
        await modalPage.closeButton.click();
      });

      it("should be able to browse to previous steps", async () => {
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.saveSeedTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.choosePinTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.selectDeviceTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.getStartedTitle);
      });
    });

    describe("When I start 'Restore device' flow", () => {
      it("should allow to restore a device (blue)", async () => {
        await onboardingPage.selectConfiguration("restore");
        expect(await onboardingPage.pageTitle.getText()).toBe(data.selectDeviceTitle);
        expect(await onboardingPage.nanoX.isVisible()).toBe(true);
        expect(await onboardingPage.nanoS.isVisible()).toBe(true);
        expect(await onboardingPage.blue.isVisible()).toBe(true);
        await onboardingPage.selectDevice("blue");
        await onboardingPage.continue();
      });

      it("should help user to restore a device", async () => {
        expect(await onboardingPage.pageTitle.getText()).toBe(data.choosePinTitle);
        await onboardingPage.continue();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.enterSeedTitle);
        await onboardingPage.continue();
      });

      it("should ask to fill a security checklist", async () => {
        expect(await onboardingPage.pageTitle.getText()).toBe(data.genuine.title);
        expect(await onboardingPage.pageDescription.getText()).toBe(data.genuine.description);
        await genuinePage.checkPin(true);
        await genuinePage.checkSeed(true);
        await genuinePage.check();
      });

      it("should display a modal to perform a genuine check", async () => {
        expect(await modalPage.isVisible()).toBe(true);
        expect(await modalPage.title.getText()).toBe(data.genuine.modalTitle);
        await modalPage.closeButton.click();
        expect(await modalPage.isVisible(true)).toBe(false);
      });

      it("should be able to browse to previous steps", async () => {
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.enterSeedTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.choosePinTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.selectDeviceTitle);
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.getStartedTitle);
      });
    });

    describe("When I start 'No device' flow", () => {
      it("should display a menu", async () => {
        await onboardingPage.selectConfiguration("nodevice");
        expect(await onboardingPage.pageTitle.getText()).toBe(data.noDeviceTitle);
        expect(await onboardingPage.buyNewButton.isVisible()).toBe(true);
        expect(await onboardingPage.learnMoreButton.isVisible()).toBe(true);
      });

      it("should be able to browse to previous steps", async () => {
        await onboardingPage.back();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.getStartedTitle);
      });
    });

    describe("When I start 'Initialized device' flow", () => {
      it("should allow to use an initialized device (nanoS)", async () => {
        await onboardingPage.selectConfiguration("initialized");
        expect(await onboardingPage.pageTitle.getText()).toBe(data.selectDeviceTitle);
        expect(await onboardingPage.nanoX.isVisible()).toBe(true);
        expect(await onboardingPage.nanoS.isVisible()).toBe(true);
        expect(await onboardingPage.blue.isVisible()).toBe(true);
        await onboardingPage.selectDevice("nanos");
        await onboardingPage.continue();
      });

      describe("When it display 'Security checklist' form", () => {
        it("should fail if PIN not choosen by user", async () => {
          expect(await onboardingPage.pageTitle.getText()).toBe(data.genuine.title);
          await genuinePage.checkPin(false);
          expect(await onboardingPage.pageTitle.getText()).toBe(data.genuine.pinError.title);
          expect(await onboardingPage.pageDescription.getText()).toBe(
            data.genuine.pinError.description,
          );
          expect(await onboardingPage.contactUsButton.isVisible()).toBe(true);
          await onboardingPage.back();
        });

        it("should fail if SEED not choosen by user", async () => {
          await genuinePage.checkPin(true);
          await genuinePage.checkSeed(false);
          expect(await onboardingPage.pageTitle.getText()).toBe(data.genuine.seedError.title);
          expect(await onboardingPage.pageDescription.getText()).toBe(
            data.genuine.seedError.description,
          );
          expect(await onboardingPage.contactUsButton.isVisible()).toBe(true);
          await onboardingPage.back();
        });
      });

      describe("When all security checklist requirements have been met", () => {
        it("should display a modal", async () => {
          expect(await onboardingPage.pageTitle.getText()).toBe(data.genuine.title);
          await genuinePage.checkPin(true);
          await genuinePage.checkSeed(true);
          await genuinePage.check();
          expect(await modalPage.isVisible()).toBe(true);
        });

        it("should perform a genuine check - and fail", async () => {
          expect(await modalPage.title.getText()).toBe(data.genuine.modalTitle);
          await app.client.pause(2000); // FIXME wait until the spinner is visible?
          await mockDeviceEvent({ type: "error", error: { name: "GenuineCheckFailed" } });
          await app.client.pause(2000);
          expect(await app.client.element("#error-GenuineCheckFailed").isVisible()).toBe(true);
          await modalPage.closeButton.click();
          await app.client.pause(2000);
        });

        it("should display a modal again", async () => {
          expect(await onboardingPage.pageTitle.getText()).toBe(data.genuine.title);
          await genuinePage.checkPin(true);
          await genuinePage.checkSeed(true);
          await genuinePage.check();
          expect(await modalPage.isVisible()).toBe(true);
        });

        it("should perform a genuine check - and pass", async () => {
          expect(await modalPage.title.getText()).toBe(data.genuine.modalTitle);
          await app.client.pause(2000); // FIXME wait until the spinner is visible?
          await mockDeviceEvent(
            { type: "listingApps", deviceInfo: deviceInfo155 },
            {
              type: "result",
              result: mockListAppsResult("Bitcoin", "", deviceInfo155),
            },
          );
          await app.client.pause(2000);
        });

        it("on success, should close the modal and change button into label", async () => {
          expect(await modalPage.isVisible(true)).toBe(false);
          expect(await genuinePage.checkLabel.getText()).toBe(data.genuine.checkLabel);
        });
      });
    });

    describe("When it displays 'Password' form", () => {
      it("should have a title and a description", async () => {
        await app.client.pause(2000);
        await onboardingPage.continue();
        expect(await onboardingPage.pageTitle.getText()).toBe(data.password.title);
        expect(await onboardingPage.pageDescription.getText()).toBe(data.password.description);
      });

      it("should be possible to skip this step", async () => {
        await passwordPage.skip();
        expect(await passwordPage.pageTitle.getText()).toBe(data.analytics.title);
        expect(await onboardingPage.pageDescription.getText()).toBe(data.analytics.description);
        await onboardingPage.back();
      });

      it("should disable continue button if passwords don't match", async () => {
        expect(await passwordPage.continueButton.isEnabled()).toBe(false);
        await passwordPage.newPasswordInput.addValue(data.password.new);
        expect(await passwordPage.continueButton.isEnabled()).toBe(false);
        await passwordPage.confirmPasswordInput.addValue(data.password.bad);
        expect(await passwordPage.continueButton.isEnabled()).toBe(false);
        expect(await passwordPage.inputError.getText()).toBe(data.password.mismatchError);
      });

      it("should enable continue button if passwords match", async () => {
        // FIXME: setValue() is not working so we use backspace to clear the input field.
        await passwordPage.confirmPasswordInput.addValue("\uE003\uE003\uE003\uE003");
        await passwordPage.confirmPasswordInput.addValue(data.password.confirm);
        expect(await passwordPage.continueButton.isEnabled()).toBe(true);
      });
    });

    describe("When it displays 'Bugs and Analytics' form", () => {
      it("should ask to send analytics data", async () => {
        await passwordPage.continue(true);
        expect(await analyticsPage.isVisible()).toBe(true);
        expect(await onboardingPage.pageTitle.getText()).toBe(data.analytics.title);
        expect(await onboardingPage.pageDescription.getText()).toBe(data.analytics.description);
      });

      describe("Technical data", () => {
        it("should display title, text and a link", async () => {
          expect(await analyticsPage.dataTitle.getText()).toBe(data.analytics.data.title);
          expect(await analyticsPage.dataText.getText()).toBe(data.analytics.data.text);
          expect(await analyticsPage.dataFakeLink.isEnabled()).toBe(true);
        });

        it("should display a modal when clicking on learn more", async () => {
          await analyticsPage.dataFakeLink.click();
          expect(await modalPage.isVisible()).toBe(true);
          expect(await modalPage.title.getText()).toBe(data.analytics.data.modalTitle);
          await modalPage.close();
          expect(await modalPage.isVisible(true)).toBe(false);
        });

        it("should display a switch selected and unabled", async () => {
          expect(await analyticsPage.dataSwitch.isVisible()).toBe(true);
          expect(await analyticsPage.dataSwitchInput.isVisible()).toBe(false);
          expect(await analyticsPage.dataSwitchInput.isEnabled()).toBe(false);
          expect(await analyticsPage.dataSwitchInput.isSelected()).toBe(true);
        });
      });

      describe("Share analytics", () => {
        it("should display title, text and a link", async () => {
          expect(await analyticsPage.shareTitle.getText()).toBe(data.analytics.share.title);
          expect(await analyticsPage.shareText.getText()).toBe(data.analytics.share.text);
          expect(await analyticsPage.shareFakeLink.isEnabled()).toBe(true);
        });

        it("should display a modal when clicking on learn more", async () => {
          await analyticsPage.shareFakeLink.click();
          expect(await modalPage.isVisible()).toBe(true);
          expect(await modalPage.title.getText()).toBe(data.analytics.share.modalTitle);
          await modalPage.close();
          expect(await modalPage.isVisible(true)).toBe(false);
        });

        it("should display a switch selected and enabled", async () => {
          expect(await analyticsPage.shareSwitch.isVisible()).toBe(true);
          expect(await analyticsPage.shareSwitchInput.isVisible()).toBe(false);
          expect(await analyticsPage.shareSwitchInput.isSelected()).toBe(true);
        });

        it("should be able to uncheck the switch", async () => {
          await analyticsPage.shareSwitch.click();
          expect(await analyticsPage.shareSwitchInput.isSelected()).toBe(false);
          await analyticsPage.shareSwitch.click();
          expect(await analyticsPage.shareSwitchInput.isSelected()).toBe(true);
        });
      });

      describe("Bug reports", () => {
        it("should display title, text and a link", async () => {
          expect(await analyticsPage.logsTitle.getText()).toBe(data.analytics.logs.title);
          expect(await analyticsPage.logsText.getText()).toBe(data.analytics.logs.text);
        });

        it("should display a switch selected and enabled", async () => {
          expect(await analyticsPage.logsSwitch.isVisible()).toBe(true);
          expect(await analyticsPage.logsSwitchInput.isVisible()).toBe(false);
          expect(await analyticsPage.logsSwitchInput.isSelected()).toBe(true);
        });

        it("should be able to uncheck the switch", async () => {
          await analyticsPage.logsSwitch.click();
          expect(await analyticsPage.logsSwitchInput.isSelected()).toBe(false);
          await analyticsPage.logsSwitch.click();
          expect(await analyticsPage.logsSwitchInput.isSelected()).toBe(true);
        });
      });
    });

    describe("When the onboarding is finished", () => {
      it("should display the success page", async () => {
        await onboardingPage.continue();
        expect(await onboardingPage.logo.isVisible()).toBe(true);
        expect(await onboardingPage.pageTitle.getText()).toBe(data.end.title);
        expect(await onboardingPage.pageDescription.getText()).toBe(data.end.description);
        expect(await onboardingPage.openButton.isVisible()).toBe(true);
        expect(await onboardingPage.twitterButton.isVisible()).toBe(true);
        expect(await onboardingPage.githubButton.isVisible()).toBe(true);
        expect(await onboardingPage.redditButton.isVisible()).toBe(true);
      });
    });
  });

  describe("When the app is opened", () => {
    it("should display the terms of use modal", async () => {
      await onboardingPage.open();
      expect(await modalPage.isVisible()).toBe(true);
      expect(await modalPage.termsCheckbox.isVisible()).toBe(true);
    });

    it("should close the modal after accepting the terms of use", async () => {
      await modalPage.termsCheckbox.click();
      await modalPage.confirmButton.click();
      expect(await modalPage.isVisible(true)).toBe(false);
    });

    it("should display the portfolio", async () => {
      expect(await portfolioPage.isVisible()).toBe(true);
    });

    it("should display the lock icon", async () => {
      expect(await portfolioPage.topbarLockButton.isVisible()).toBe(true);
    });

    describe("When I lock the app", () => {
      it("should display lock screen", async () => {
        await portfolioPage.topbarLockButton.click();
        expect(await portfolioPage.isVisible()).toBe(false);
        expect(await lockPage.isVisible()).toBe(true);
        expect(await lockPage.logo.isVisible()).toBe(true);
        expect(await lockPage.pageTitle.getText()).toBe(data.lock.title);
        expect(await lockPage.pageDescription.getText()).toBe(data.lock.description);
        expect(await lockPage.passwordInput.isVisible()).toBe(true);
        expect(await lockPage.revealButton.isVisible()).toBe(true);
        expect(await lockPage.loginButton.isVisible()).toBe(true);
        expect(await lockPage.forgottenPasswordButton.isVisible()).toBe(true);
      });

      describe("When I click on reveal button", () => {
        it("should reveal the password input value", async () => {
          await lockPage.revealButton.click();
          expect(await lockPage.passwordInput.getValue()).toBe(true);
        });
      });
    });

    describe("When I unlock the app", () => {
      it("should back to the portfolio", async () => {
        await lockPage.topbarLockButton.click();
        expect(await lockPage.isVisible()).toBe(false);
        expect(await portfolioPage.isVisible()).toBe(true);
      });
    });
  });
});
