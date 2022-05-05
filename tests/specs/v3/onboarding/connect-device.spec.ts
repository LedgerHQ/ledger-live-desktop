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

      await test.step(`[${nano}] Already set up`, async () => {
        if (nano !== Nano.nanoSP) {
          expect(await page.screenshot()).toMatchSnapshot(`v3-device-connection-${nano}.png`);
          await onboardingPage.connectDevice();
          await onboardingPage.warnings();
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
