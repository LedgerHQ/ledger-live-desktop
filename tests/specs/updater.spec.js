import initialize, { app } from "../common.js";

describe("AppUpdater", () => {
  initialize("appUpdater", {
    userData: "1AccountBTC1AccountETHwCarousel",
    env: { DEBUG_UPDATE: true, DISABLE_MOCK_POINTER_EVENTS: false },
  });

  const $ = selector => app.client.$(selector);

  it("[idle] state should not be visible", async () => {
    const updateBanner = await $("#app-update-banner");
    expect(await updateBanner.isDisplayed()).toBe(false);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "app-updater-idle",
    });
  });

  it("[checking] state should be visible", async () => {
    const cta = await $("#app-update-debug-checking");
    expect(await cta.isDisplayed()).toBe(true);
    await cta.click();
    const updateBanner = await $("#app-update-banner");
    expect(await updateBanner.isDisplayedInViewport()).toBe(true);
  });

  it("[check-success] state should be visible", async () => {
    const cta = await $("#app-update-debug-check-success");
    expect(await cta.isDisplayed()).toBe(true);
    await cta.click();
    const updateBanner = await $("#app-update-banner");
    expect(await updateBanner.isDisplayedInViewport()).toBe(true);
  });

  it("[update-available] state should be visible", async () => {
    const cta = await $("#app-update-debug-update-available");
    expect(await cta.isDisplayed()).toBe(true);
    await cta.click();
    const updateBanner = await $("#app-update-banner");
    expect(await updateBanner.isDisplayedInViewport()).toBe(true);
  });

  it("[download-progress] state should be visible", async () => {
    const cta = await $("#app-update-debug-download-progress");
    expect(await cta.isDisplayed()).toBe(true);
    await cta.click();
    const updateBanner = await $("#app-update-banner");
    expect(await updateBanner.isDisplayedInViewport()).toBe(true);
  });

  it("[error] state should be visible", async () => {
    const cta = await $("#app-update-debug-error");
    expect(await cta.isDisplayed()).toBe(true);
    await cta.click();
    const updateBanner = await $("#app-update-banner");
    expect(await updateBanner.isDisplayedInViewport()).toBe(true);

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "app-updater-error-with-carousel",
    });
  });

  it("[error] state (any) should be visible, without the carousel", async () => {
    const settingsButton = await $("#topbar-settings-button");
    await settingsButton.click();

    const carouselToggle = await $("#settings-display-carousel");
    await carouselToggle.click();
    expect(await carouselToggle.isSelected()).toBe(false);

    const dashbord = await $("#drawer-dashboard-button");
    await dashbord.click();

    const updateBanner = await $("#app-update-banner");
    expect(await updateBanner.isDisplayedInViewport()).toBe(true);

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "app-updater-error-without-carousel",
    });
  });
});
