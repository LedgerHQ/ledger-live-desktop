import test from "../../../fixtures/common";
import { expect } from "@playwright/test";
import { OnboardingPage } from "../../../models/v3/OnboardingPage";
import { DeviceAction } from "../../../models/DeviceAction";

enum Nano {
  nanoX = "nanoX",
  nanoS = "nanoS",
  nanoSP = "nanoSPlus",
}

const nanos = [Nano.nanoX, Nano.nanoS, Nano.nanoSP];

test.describe.parallel("Onboarding", () => {
  for (const nano of nanos) {
    test(`[${nano}] Onboarding flow already set up`, async ({ page }) => {
      const onboardingPage = new OnboardingPage(page);
      const deviceAction = new DeviceAction(page);

      await test.step("Get started", async () => {
        await onboardingPage.getStarted();
      });

      await test.step("Terms of service", async () => {
        expect(await page.screenshot()).toMatchSnapshot("v3-terms.png");
        await onboardingPage.acceptTermsAndConditions();
      });

      await test.step(`[${nano}] Select Device`, async () => {
        if (nano !== Nano.nanoSP) {
          expect(await page.screenshot()).toMatchSnapshot("v3-device-selection.png");
          await onboardingPage.selectDevice(nano);
        }
      });

      await test.step(`[${nano}] Restore device`, async () => {
        if (nano !== Nano.nanoSP) {
          expect(await page.screenshot()).toMatchSnapshot("v3-restore-device.png");
          await onboardingPage.restoreDevice();

          expect(await page.screenshot()).toMatchSnapshot("v3-be-careful.png");
          await onboardingPage.gotIt();

          expect(await page.screenshot()).toMatchSnapshot("v3-recovery-warning.png");
          await onboardingPage.continue();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-restore-tutorial",
            "get-started-1.png",
          ]);
          await onboardingPage.continueTutorial();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-restore-tutorial",
            "get-started-2.png",
          ]);
          await onboardingPage.continueTutorial();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-restore-tutorial",
            "pin-code-1.png",
          ]);
          await onboardingPage.acceptPrivatePinCode();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-restore-tutorial",
            "pin-code-2.png",
          ]);
          await onboardingPage.continueTutorial();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-restore-tutorial",
            "pin-code-3.png",
          ]);
          await onboardingPage.continueTutorial();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-restore-tutorial",
            "recovery-phrase-1.png",
          ]);
          await onboardingPage.acceptRecoveryPhraseLoss();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-restore-tutorial",
            "recovery-phrase-2.png",
          ]);
          await onboardingPage.continueTutorial();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-restore-tutorial",
            "recovery-phrase-3.png",
          ]);
          await onboardingPage.continueTutorial();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-restore-tutorial",
            "recovery-phrase-4.png",
          ]);
          await onboardingPage.continueTutorial();
        }
      });

      await test.step(`[${nano}] Device genuine check`, async () => {
        if (nano !== Nano.nanoSP) {
          expect(await page.screenshot()).toMatchSnapshot("v3-genuine-check.png");
          await onboardingPage.checkDevice();
        }
      });

      await test.step("Pass genuine check", async () => {
        if (nano !== Nano.nanoSP) {
          expect(await page.screenshot()).toMatchSnapshot("v3-genuine-checking.png");
          await deviceAction.genuineCheck();
          expect(await page.screenshot()).toMatchSnapshot("v3-genuine-check-done.png");
        }
      });

      await test.step("Reach app", async () => {
        if (nano !== Nano.nanoSP) {
          expect(await page.screenshot()).toMatchSnapshot("v3-onboarding-last-action.png");
          await onboardingPage.continue();
          expect(await page.screenshot()).toMatchSnapshot("v3-onboarding-complete.png");
        }
      });
    });
  }
});
