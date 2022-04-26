import { expect } from "@playwright/test";

import test from "../../fixtures/common";

// Comment out to disable recorder
// process.env.PWDEBUG = "1";

test("Onboarding", async ({ page }) => {
  await test.step("Get started", async () => {
    await page.locator("data-testid=onboarding-get-started-button").isVisible();
    expect(await page.screenshot()).toMatchSnapshot(`v3-onboarding-getstarted.png`);
  });

  await test.step("Terms and conditions", async () => {
    await page.locator("data-testid=onboarding-get-started-button").click();
    expect(await page.screenshot()).toMatchSnapshot(`v3-onboarding-terms.png`);

    await page.locator("#termsOfUseCheckbox").check();
    expect(await page.screenshot()).toMatchSnapshot(`v3-onboarding-terms-terms-checked.png`);

    await page.locator("#privacyPolicyCheckbox").check();
    expect(await page.screenshot()).toMatchSnapshot(`v3-onboarding-terms-privacy-checked.png`);

    await page.locator("data-testid=onboarding-cta-done").click();
  });

  await test.step("Choose your device", async () => {
    expect(await page.screenshot()).toMatchSnapshot(`v3-getstarted-choose-device.png`);

    await page.locator("#device-nanoS").hover();
    expect(await page.screenshot()).toMatchSnapshot(`v3-getstarted-choose-device-nanos.png`);

    await page.locator("#device-nanoSP").hover();
    expect(await page.screenshot()).toMatchSnapshot(`v3-getstarted-choose-device-nanosp.png`);

    await page.locator("#device-nanoX").hover();
    expect(await page.screenshot()).toMatchSnapshot(`v3-getstarted-choose-device-nanoX.png`);
  });
});
