import test from "../../fixtures/common";
import { expect } from "@playwright/test";
import { OnboardingPage } from "../../models/OnboardingPage";
import { DeviceAction } from "../../models/DeviceAction";

const nanos = {
  nanoX: "Nano X",
  nanoS: "Nano S",
  nanoSP: "Nano S Plus",
};

test.describe.parallel("Onboarding", () => {
  for (const nano of Object.keys(nanos)) {
    test(`[${nanos[nano]}] Onboarding flow already set up`, async ({ page }) => {
      const onboardingPage = new OnboardingPage(page);
      const deviceAction = new DeviceAction(page);

      await test.step("Get started", async () => {
        expect(await onboardingPage.getStartedButton).toBeVisible();
        await onboardingPage.getStarted();
      });

      await test.step("Terms of service", async () => {
        await onboardingPage.acceptTerms();
      });

      await test.step(`[${nanos[nano]}] Select Device`, async () => {
        await onboardingPage.selectDevice(nano);
      });

      await test.step(`[${nanos[nano]}] Already set up`, async () => {
        await onboardingPage.connectDevice();
      });

      await test.step(`[${nanos[nano]}] Device genuine check`, async () => {
        await onboardingPage.continue();
        await onboardingPage.checkDevice();
      });

      await test.step("Pass genuine check", async () => {
        await deviceAction.genuineCheck();
      });

      await test.step("Reach app", async () => {
        await onboardingPage.continue();
      });
    });
  }
});
