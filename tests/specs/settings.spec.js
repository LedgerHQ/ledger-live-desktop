import initialize, { app, modalPage } from "../common.js";

describe("Settings", () => {
  initialize("settings", {
    userData: "onboardingcompleted",
  });

  const $ = selector => app.client.$(selector);

  it("naive discreet mode toggle and assorted screens", async () => {
    // Toggle discreet mode twice
    const discreetButton = await $("#topbar-discreet-button");
    await discreetButton.click();
    await discreetButton.click();

    const dashboardButton = await $("#drawer-dashboard-button");
    await dashboardButton.click();
    const exchangeButton = await $("#drawer-exchange-button");
    await exchangeButton.click();

    // Open settings and navigate all tabs
    const settingsButton = await $("#topbar-settings-button");
    await settingsButton.click();

    // Open settings and navigate all tabs
    const accountsTab = await $("#settings-accounts-tab");
    await accountsTab.click();
    const aboutTab = await $("#settings-about-tab");
    await aboutTab.click();
    const helpTab = await $("#settings-help-tab");
    await helpTab.click();
    const experimentalTab = await $("#settings-experimental-tab");
    await experimentalTab.click();
    expect(await modalPage.isDisplayed(true)).toBe(false);
  });
});
