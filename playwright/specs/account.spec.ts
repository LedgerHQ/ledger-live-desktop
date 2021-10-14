import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { AccountModal } from "../models/AccountModal";
import { Device } from "../models/DeviceAction";

// Comment out to disable recorder
// process.env.PWDEBUG = "1";

// Use specific userdata
test.use({ userdata: "skip-onboarding" });

test("Add account", async ({ page }) => {
  const AccountPage = new AccountModal(page);
  const DeviceAction = new Device(page);

  await test.step("Open modal", async () => {
    await AccountPage.add();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`open-modal.png`);
  });

  await test.step("Select currency", async () => {
    await AccountPage.select("Bitcoin (BTC)");
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`select-currency.png`);
  });

  await test.step("Open device app", async () => {
    await DeviceAction.openApp();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`device-open-app.png`);
  });

  await test.step("Complete", async () => {
    await AccountPage.complete();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`complete.png`);
  });
});
