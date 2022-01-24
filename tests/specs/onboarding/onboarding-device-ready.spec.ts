import test from "../../fixtures/common";
import { expect } from "@playwright/test";
import { OnboardingPage } from "../../models/OnboardingPage";
import { Modal } from "../../models/Modal";
import { DeviceAction } from "../../models/DeviceAction";

const nanos = ["Nano X", "Nano S", "Blue"];

test.describe.parallel("Onboarding", () => {
  for (const nano of nanos) {
    test(`[${nano}] Onboarding flow already set up`, async ({ page }) => {
      const onboardingPage = new OnboardingPage(page);
      const modalPage = new Modal(page);
      const deviceAction = new DeviceAction(page);

      await test.step("Get started", async () => {
        expect(await onboardingPage.getStartedButton).toBeVisible();
        expect(await page.screenshot()).toMatchSnapshot(`getstarted.png`);
        await onboardingPage.getStarted();
      });

      await test.step("Terms of service", async () => {
        expect(await page.screenshot()).toMatchSnapshot(`terms.png`);
        await onboardingPage.acceptTerms();
      });

      await test.step(`[${nano}] Select Device`, async () => {
        expect(await page.screenshot()).toMatchSnapshot(`${nano}-selection.png`);
        await onboardingPage.selectDevice(nano);
      });

      await test.step(`[${nano}] Already set up`, async () => {
        expect(await page.screenshot()).toMatchSnapshot(`onboarding-${nano}.png`);
        await onboardingPage.connectDevice();
        await modalPage.container.waitFor({ state: "visible" });
      });

      await test.step(`[${nano}] Device genuine check`, async () => {
        expect(await page.screenshot()).toMatchSnapshot(`connect-${nano}.png`);
        await onboardingPage.continue();
        await onboardingPage.checkDevice();
        expect(await page.screenshot()).toMatchSnapshot(`before-genuine-check.png`);
      });

      await test.step("Pass genuine check", async () => {
        await deviceAction.genuineCheck();
        expect(await page.screenshot()).toMatchSnapshot("genuine-check-done.png");
      });

      await test.step("Reach app", async () => {
        await onboardingPage.continue();
        expect(await page.screenshot()).toMatchSnapshot(`onboarding-complete.png`);
      });
    });
  }
});
