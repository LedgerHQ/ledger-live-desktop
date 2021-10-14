/* eslint-disable jest/expect-expect */
import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Device } from "../models/DeviceAction";

// Comment out to disable recorder
process.env.PWDEBUG = "1";

test("Onboarding", async ({ page }) => {
  const DeviceAction = new Device(page);

  await test.step("Get started", async () => {
    // expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`getstarted.png`);
    await page.click('button:has-text("Get started")');
  });

  await test.step("Terms", async () => {
    // expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`terms.png`);
    await page.click("#onboarding-terms-check");
    await page.click('button:has-text("Enter Ledger app")');
  });

  await test.step("Select NanoX", async () => {
    // expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`device-selection.png`);
    await page.click('button:has-text("Nano X")');
  });

  await test.step("Already set up", async () => {
    // expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`onboarding-nanox.png`);
    await page.click(
      'button:has-text("Connect deviceConnect your Nano XIs your device already set up? Connect it to th")',
    );
    // expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`connect-nanox.png`);
  });

  await test.step("Device genuine check", async () => {
    await page.click('button:has-text("Continue")');
    await page.click('button:has-text("Check my Nano")');

    // expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`before-genuine-check.png`);
  });

  await test.step("Pass genuine check", async () => {
    // Mock genuine check
    await DeviceAction.genuineCheck();

    // expect(await page.screenshot({ fullPage: true })).toMatchSnapshot("genuine-check-done.png");
  });

  await test.step("Reach app", async () => {
    await page.click('button:has-text("Continue")');
    // expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`landing.png`);
  });
});
