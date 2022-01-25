import test from "../../fixtures/common";
import { expect } from "@playwright/test";
import { OnboardingPage } from "../../models/OnboardingPage";
import { DeviceAction } from "../../models/DeviceAction";

const nanos = ["Nano X", "Nano S", "Blue"];

test.describe.parallel("Onboarding", () => {
  for (const nano of nanos) {
    test(`[${nano}] Onboarding flow already set up`, async ({ page }) => {
      const onboardingPage = new OnboardingPage(page);
      const deviceAction = new DeviceAction(page);

      await test.step("Get started", async () => {
        expect(await onboardingPage.getStartedButton).toBeVisible();
        await onboardingPage.getStarted();
      });

      await test.step("Terms of service", async () => {
        await onboardingPage.acceptTerms();
      });

      await test.step(`[${nano}] Select Device`, async () => {
        await onboardingPage.selectDevice(nano);
      });

      await test.step(`[${nano}] Already set up`, async () => {
        await onboardingPage.connectDevice();
      });

      await test.step(`[${nano}] Device genuine check`, async () => {
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
