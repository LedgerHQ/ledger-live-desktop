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
  portfolioPage,
  lockscreenPage,
} from "../common.js";
import data from "../data/onboarding/";

describe("When I launch the app for the first time", () => {
  initialize();

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
      await app.client.waitForDisplayed("#loading-logo");
      expect(await onboardingPage.loadingLogo.isDisplayed()).toBe(true);
    });

    it("should end loading and animated logo is hidden", async () => {
      await app.client.waitForDisplayed("#loading-logo", 5000, true);
      expect(await onboardingPage.loadingLogo.isDisplayed()).toBe(false);
    });
  });

  describe("When it displays the welcome page", () => {
    it("should propose to change the theme", async () => {
      expect(await onboardingPage.isDisplayed()).toBe(true);
      expect(await onboardingPage.logo.isDisplayed()).toBe(true);
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
      expect(await onboardingPage.logo.isDisplayed()).toBe(true);
      expect(await onboardingPage.pageTitle.getText()).toBe(data.getStartedTitle);
      expect(await onboardingPage.newDeviceButton.isDisplayed()).toBe(true);
      expect(await onboardingPage.restoreDeviceButton.isDisplayed()).toBe(true);
      expect(await onboardingPage.initializedDeviceButton.isDisplayed()).toBe(true);
      expect(await onboardingPage.noDeviceButton.isDisplayed()).toBe(true);
    });

    describe("When I start 'Setup new device' flow", () => {
      it("should allow to setup new device (nanoX)", async () => {
        await onboardingPage.selectConfiguration("new");
        expect(await onboardingPage.pageTitle.getText()).toBe(data.selectDeviceTitle);
        expect(await onboardingPage.nanoX.isDisplayed()).toBe(true);
        expect(await onboardingPage.nanoS.isDisplayed()).toBe(true);
        expect(await onboardingPage.blue.isDisplayed()).toBe(true);
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
        expect(await modalPage.isDisplayed()).toBe(true);
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
        expect(await onboardingPage.nanoX.isDisplayed()).toBe(true);
        expect(await onboardingPage.nanoS.isDisplayed()).toBe(true);
        expect(await onboardingPage.blue.isDisplayed()).toBe(true);
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
        expect(await modalPage.isDisplayed()).toBe(true);
        expect(await modalPage.title.getText()).toBe(data.genuine.modalTitle);
        await modalPage.closeButton.click();
        expect(await modalPage.isDisplayed(true)).toBe(false);
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
        expect(await onboardingPage.buyNewButton.isDisplayed()).toBe(true);
        expect(await onboardingPage.learnMoreButton.isDisplayed()).toBe(true);
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
        expect(await onboardingPage.nanoX.isDisplayed()).toBe(true);
        expect(await onboardingPage.nanoS.isDisplayed()).toBe(true);
        expect(await onboardingPage.blue.isDisplayed()).toBe(true);
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
          expect(await onboardingPage.contactUsButton.isDisplayed()).toBe(true);
          await onboardingPage.back();
        });

        it("should fail if SEED not choosen by user", async () => {
          await genuinePage.checkPin(true);
          await genuinePage.checkSeed(false);
          expect(await onboardingPage.pageTitle.getText()).toBe(data.genuine.seedError.title);
          expect(await onboardingPage.pageDescription.getText()).toBe(
            data.genuine.seedError.description,
          );
          expect(await onboardingPage.contactUsButton.isDisplayed()).toBe(true);
          await onboardingPage.back();
        });
      });

      describe("When all security checklist requirements have been met", () => {
        it("should display a modal", async () => {
          expect(await onboardingPage.pageTitle.getText()).toBe(data.genuine.title);
          await genuinePage.checkPin(true);
          await genuinePage.checkSeed(true);
          await genuinePage.check();
          expect(await modalPage.isDisplayed()).toBe(true);
        });

        it("should perform a genuine check - and fail", async () => {
          expect(await modalPage.title.getText()).toBe(data.genuine.modalTitle);
          await app.client.pause(2000); // FIXME wait until the spinner is visible?
          await mockDeviceEvent(
            { type: "error", error: { name: "GenuineCheckFailed" } },
            { type: "complete" },
          );
          await app.client.pause(2000);
          expect(await app.client.element("#error-GenuineCheckFailed").isDisplayed()).toBe(true);
          await modalPage.closeButton.click();
          await app.client.pause(2000);
        });

        it("should display a modal again", async () => {
          expect(await onboardingPage.pageTitle.getText()).toBe(data.genuine.title);
          await genuinePage.checkPin(true);
          await genuinePage.checkSeed(true);
          await genuinePage.check();
          expect(await modalPage.isDisplayed()).toBe(true);
        });

        it("should perform a genuine check - and pass", async () => {
          expect(await modalPage.title.getText()).toBe(data.genuine.modalTitle);
          await app.client.pause(2000); // FIXME wait until the spinner is visible?
          await mockDeviceEvent(
            { type: "listingApps", deviceInfo },
            {
              type: "result",
              result: mockListAppsResult("Bitcoin", "", deviceInfo),
            },
          );
          await app.client.pause(2000);
        });

        it("on success, should close the modal and change button into label", async () => {
          expect(await modalPage.isDisplayed(true)).toBe(false);
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
        expect(await analyticsPage.isDisplayed()).toBe(true);
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
          expect(await modalPage.isDisplayed()).toBe(true);
          expect(await modalPage.title.getText()).toBe(data.analytics.data.modalTitle);
          await modalPage.close();
          expect(await modalPage.isDisplayed(true)).toBe(false);
        });

        it("should display a switch selected and unabled", async () => {
          expect(await analyticsPage.dataSwitch.isDisplayed()).toBe(true);
          expect(await analyticsPage.dataSwitchInput.isDisplayed()).toBe(false);
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
          expect(await modalPage.isDisplayed()).toBe(true);
          expect(await modalPage.title.getText()).toBe(data.analytics.share.modalTitle);
          await modalPage.close();
          expect(await modalPage.isDisplayed(true)).toBe(false);
        });

        it("should display a switch selected and enabled", async () => {
          expect(await analyticsPage.shareSwitch.isDisplayed()).toBe(true);
          expect(await analyticsPage.shareSwitchInput.isDisplayed()).toBe(false);
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
          expect(await analyticsPage.logsSwitch.isDisplayed()).toBe(true);
          expect(await analyticsPage.logsSwitchInput.isDisplayed()).toBe(false);
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
        expect(await onboardingPage.logo.isDisplayed()).toBe(true);
        expect(await onboardingPage.pageTitle.getText()).toBe(data.end.title);
        expect(await onboardingPage.pageDescription.getText()).toBe(data.end.description);
        expect(await onboardingPage.openButton.isDisplayed()).toBe(true);
        expect(await onboardingPage.twitterButton.isDisplayed()).toBe(true);
        expect(await onboardingPage.githubButton.isDisplayed()).toBe(true);
        expect(await onboardingPage.redditButton.isDisplayed()).toBe(true);
      });
    });
  });

  describe("When the app is opened", () => {
    it("should display the terms of use modal", async () => {
      await onboardingPage.open();
      expect(await modalPage.isDisplayed()).toBe(true);
      expect(await modalPage.termsCheckbox.isDisplayed()).toBe(true);
    });

    it("should close the modal after accepting the terms of use", async () => {
      await modalPage.termsCheckbox.click();
      await modalPage.confirmButton.click();
      expect(await modalPage.isDisplayed(true)).toBe(false);
    });

    it("should display the portfolio", async () => {
      expect(await portfolioPage.isDisplayed()).toBe(true);
    });

    it("should display the lock icon", async () => {
      expect(await portfolioPage.topbarLockButton.isDisplayed()).toBe(true);
    });

    describe("When I lock the app", () => {
      it("should display lock screen", async () => {
        await portfolioPage.topbarLockButton.click();
        expect(await portfolioPage.isDisplayed(true)).toBe(false);
        expect(await lockscreenPage.isDisplayed()).toBe(true);
        expect(await lockscreenPage.logo.isDisplayed()).toBe(true);
        // FIXME: LL-2410
        // expect(await lockscreenPage.pageTitle.getText()).toBe(data.lock.title);
        // expect(await lockscreenPage.pageDescription.getText()).toBe(data.lock.description);
        expect(await lockscreenPage.passwordInput.isDisplayed()).toBe(true);
        expect(await lockscreenPage.revealButton.isDisplayed()).toBe(true);
        expect(await lockscreenPage.loginButton.isDisplayed()).toBe(true);
        expect(await lockscreenPage.forgottenButton.isDisplayed()).toBe(true);
      });

      describe("When I click on reveal button", () => {
        it("should reveal the password input value", async () => {
          await lockscreenPage.revealButton.click();
          expect(await lockscreenPage.passwordInput.getAttribute("type")).toBe("text");
        });
      });

      describe("When I click on forgotten password button", () => {
        it("should open a modal and ask to reset the app", async () => {
          await lockscreenPage.forgottenButton.click();
          expect(await modalPage.isDisplayed()).toBe(true);
          expect(await modalPage.title.getText()).toBe(data.lockscreen.reset.title);
          expect(await modalPage.closeButton.isDisplayed()).toBe(true);
          expect(await modalPage.cancelButton.isDisplayed()).toBe(true);
          expect(await modalPage.confirmButton.isDisplayed()).toBe(true);
          await modalPage.closeButton.click();
          expect(await modalPage.isDisplayed(true)).toBe(false);
        });
      });
    });

    describe("When I unlock the app", () => {
      describe("and password is incorrect", () => {
        it("should warn about password mismatch", async () => {
          await lockscreenPage.passwordInput.addValue(`${data.password.bad}\uE007`);
          expect(await lockscreenPage.inputError.getText()).toBe(data.lockscreen.incorrectPassword);
        });
      });

      describe("and password is correct", () => {
        it("should back to the portfolio", async () => {
          await lockscreenPage.passwordInput.setValue(data.password.new);
          await lockscreenPage.loginButton.click();
          expect(await lockscreenPage.isDisplayed(true)).toBe(false);
          expect(await portfolioPage.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
