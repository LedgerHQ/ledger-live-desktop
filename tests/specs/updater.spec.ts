import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../models/Layout";
import { SettingsPage } from "../models/SettingsPage";
import { AppUpdater } from "../models/AppUpdater";

test.use({
  userdata: "1AccountBTC1AccountETHwCarousel",
  env: { DEBUG_UPDATE: true },
});

test("Updater", async ({ page }) => {
  const layout = new Layout(page);
  const settingsPage = new SettingsPage(page);
  const appUpdater = new AppUpdater(page);

  await test.step("[idle] state should not be visible", async () => {
    expect(await layout.appUpdateBanner.isHidden()).toBe(true);
    expect(await page.screenshot()).toMatchSnapshot("app-updater-idle.png");
  });

  await test.step("[checking] state should be visible", async () => {
    await appUpdater.setStatus("checking");
    expect(await page.screenshot()).toMatchSnapshot("app-updater-layout.png");
    expect(await layout.appUpdateBanner.screenshot()).toMatchSnapshot("app-updater-checking.png");
  });

  await test.step("[check-success] state should be visible", async () => {
    await appUpdater.setStatus("check-success");
    expect(await layout.appUpdateBanner.screenshot()).toMatchSnapshot(
      "app-updater-check-success.png",
    );
  });

  await test.step("[update-available] state should be visible", async () => {
    await appUpdater.setStatus("update-available");
    expect(await layout.appUpdateBanner.screenshot()).toMatchSnapshot(
      "app-updater-update-available.png",
    );
  });

  await test.step("[download-progress] state should be visible", async () => {
    await appUpdater.setStatus("download-progress");
    expect(await layout.appUpdateBanner.screenshot()).toMatchSnapshot(
      "app-updater-download-progress.png",
    );
  });

  await test.step("[error] state should be visible", async () => {
    await appUpdater.setStatus("error");
    expect(await layout.appUpdateBanner.screenshot()).toMatchSnapshot("app-updater-error.png");
    expect(await page.screenshot()).toMatchSnapshot("app-updater-error-with-carousel.png");
  });

  await test.step("[error] state (any) should be visible, without the carousel", async () => {
    await layout.goToSettings();
    await settingsPage.carouselSwitchButton.click();
    expect(await settingsPage.carouselSwitchButton.locator("input").isChecked()).toBe(false);
    await layout.goToPortfolio();
    expect(await layout.appUpdateBanner.isVisible()).toBe(true);
    expect(await page.screenshot()).toMatchSnapshot("app-updater-error-without-carousel.png");
  });
});
