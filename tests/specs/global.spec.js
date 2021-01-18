import initialize, { app, modalPage } from "../common.js";

describe("Global", () => {
  initialize("global", {
    userData: "1AccountBTC1AccountETHStarred",
  });

  const $ = selector => app.client.$(selector);

  it("can open send modal", async () => {
    const sendButton = await $("#drawer-send-button");
    await sendButton.click();
    await modalPage.isDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-send-modal",
    });
    await modalPage.close();
    expect(await modalPage.isDisplayed(true)).toBe(false);
  });

  it("can open receive modal", async () => {
    const sendButton = await $("#drawer-receive-button");
    await sendButton.click();
    await modalPage.isDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-receive-modal",
    });
    await modalPage.close();
    expect(await modalPage.isDisplayed(true)).toBe(false);
  });

  it("shows experimental badge, and can access the page", async () => {
    const experimentalButton = await $("#drawer-experimental-button");
    await experimentalButton.click();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-experimental-features",
    });
    const elem = await $("#drawer-dashboard-button");
    await elem.click();
  });

  it("shows a starred account, and can access the page", async () => {
    const starredAccountContainer = await $("#sidebar-stars-container");
    starredAccountContainer.waitForDisplayed();
    const starredAccount = await $("#sidebar-stars-container .bookmarked-account-item:first-child");
    starredAccount.click();
    await app.client.pause(1000);

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-starred-account",
    });
    const elem = await $("#drawer-dashboard-button");
    await elem.click();
  });

  it("can toggle discreet mode", async () => {
    const discreetModeButton = await $("#topbar-discreet-button");
    discreetModeButton.click();
    await app.client.pause(1000);

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-discreet-mode",
    });
    const elem = await $("#drawer-dashboard-button");
    await elem.click();
  });

  it("can collapse the main sidebar", async () => {
    const collapseSidebarButton = await $("#drawer-collapse-button");
    collapseSidebarButton.click();

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-collapse-sidebar",
    });
  });

  it("shows the carousel and can dismiss it", async () => {
    const carousel = await $("#carousel");
    await carousel.waitForDisplayed();

    const carouselDismissButton = await $("#carousel-dismiss");
    await carouselDismissButton.click();
    await app.client.pause(400);

    const carouselDismissButtonConfirm = await $("#carousel-dismiss-confirm")
    await carouselDismissButtonConfirm.click();
    await app.client.pause(400);

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-dismiss-carousel",
    });
  });
});
