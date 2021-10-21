import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { OnboardingPage } from "../models/OnboardingPage";
import { DeviceAction } from "../models/DeviceAction";

// Comment out to disable recorder
// process.env.PWDEBUG = "1";

test("Onboarding", async ({ page }) => {
  const onboardingPage = new OnboardingPage(page);
  const deviceAction = new DeviceAction(page);

  await test.step("Get started", async () => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`getstarted.png`);
    await onboardingPage.getStarted();
  });

  await test.step("Terms of service", async () => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`terms.png`);
    await onboardingPage.acceptTerms();
  });

  await test.step("Select Nano X", async () => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`device-selection.png`);
    await onboardingPage.selectDevice("Nano X");
  });

  await test.step("Already set up", async () => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`onboarding-nanox.png`);
    await onboardingPage.connectDevice();
  });

  await test.step("Device genuine check", async () => {
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`connect-nanox.png`);
    await onboardingPage.continue();
    await onboardingPage.checkDevice();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`before-genuine-check.png`);
  });

  await test.step("Pass genuine check", async () => {
    await deviceAction.genuineCheck();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot("genuine-check-done.png");
  });

  await test.step("Reach app", async () => {
    await onboardingPage.continue();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`landing.png`);
  });
});
