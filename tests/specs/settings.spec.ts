import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { SettingsPage } from "../models/SettingsPage";
import { Layout } from "../models/Layout";

test.use({ userdata: "skip-onboarding" });

test("Settings", async ({ page }) => {
  const settingsPage = new SettingsPage(page);
  const layout = new Layout(page);

  await test.step("go to settings", async () => {
    await layout.goToSettings();
    // expect(await page.screenshot()).toMatchSnapshot("settings-general-page.png"); FIXME: flaky on slow machines
  });

  await test.step("go to settings -> accounts", async () => {
    await settingsPage.goToAccountsTab();
    expect(await page.screenshot()).toMatchSnapshot("settings-accounts-page.png");
  });

  await test.step("go to settings -> about", async () => {
    await settingsPage.goToAboutTab();
    expect(await page.screenshot()).toMatchSnapshot("settings-about-page.png");
  });

  await test.step("go to settings -> help", async () => {
    await settingsPage.goToHelpTab();
    expect(await page.screenshot()).toMatchSnapshot("settings-help-page.png");
  });

  await test.step("go to settings -> experimental", async () => {
    await settingsPage.goToExperimentalTab();
    expect(await page.screenshot()).toMatchSnapshot("settings-experimental-page.png");
  });
});
