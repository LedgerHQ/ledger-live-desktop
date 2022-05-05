import test from "../../../fixtures/common";
import { expect } from "@playwright/test";
import { OnboardingPage } from "../../../models/v3/OnboardingPage";

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

      await test.step("Get started", async () => {
        await onboardingPage.getStarted();
      });

      await test.step("Terms of service", async () => {
        await onboardingPage.acceptTermsAndConditions();
      });

      await test.step(`[${nano}] Select Device`, async () => {
        if (nano !== Nano.nanoSP) {
          await onboardingPage.selectDevice(nano);
        }
      });

      await test.step(`[${nano}] Restore device`, async () => {
        if (nano !== Nano.nanoSP) {
          expect(await page.screenshot()).toMatchSnapshot("v3-restore-device.png");
          await onboardingPage.restoreDevice();

          await onboardingPage.warnings();

          await onboardingPage.startTutorial("v3-restore-tutorial");

          await onboardingPage.setPinCode("v3-restore-tutorial");

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
          await onboardingPage.checkDevice();
        }
      });

      await test.step("Pass genuine check", async () => {
        if (nano !== Nano.nanoSP) {
          await onboardingPage.genuineCheck();
        }
      });

      await test.step("Reach app", async () => {
        if (nano !== Nano.nanoSP) {
          await onboardingPage.reachApp();
        }
      });
    });
  }
});
