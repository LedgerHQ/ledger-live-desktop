import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { OnboardingPage } from "../models/OnboardingPage";
import { DeviceAction } from "../models/DeviceAction";

test("Onboarding", async ({ page }) => {
  const onboardingPage = new OnboardingPage(page);
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

  await test.step("Select Nano X", async () => {
    expect(await page.screenshot()).toMatchSnapshot(`device-selection.png`);
    await onboardingPage.selectDevice("Nano X");
  });

  await test.step("Already set up", async () => {
    expect(await page.screenshot()).toMatchSnapshot(`onboarding-nanox.png`);
    await onboardingPage.connectDevice();
  });

  await test.step("Device genuine check", async () => {
    expect(await page.screenshot()).toMatchSnapshot(`connect-nanox.png`);
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
