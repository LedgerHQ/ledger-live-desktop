import initialize, { app, portfolioPage, modalPage } from "../common.js";

describe("Global", () => {
  initialize("global", {
    userData: "1AccountBTC1AccountETHStarred",
  });

  it("can open send modal", async () => {
    await portfolioPage.goToPortfolio();
    const sendButton = await portfolioPage.drawerSendButton();
    await sendButton.click();
    await modalPage.waitForDisplayed();
    expect(await app.client.screenshot(2000)).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-send-modal",
    });
  });

  it("can open receive modal", async () => {
    await modalPage.close();
    await portfolioPage.goToPortfolio();
    const receiveButton = await portfolioPage.drawerReceiveButton();
    await receiveButton.click();
    await modalPage.waitForDisplayed();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-receive-modal",
    });
  });

  it("shows experimental badge, and can access the page", async () => {
    await modalPage.close();
    await portfolioPage.goToPortfolio();
    const experimentalButton = await portfolioPage.drawerExperimentalButton();
    await experimentalButton.click();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-experimental-features",
    });
  });

  it("shows a starred account, and can access the page", async () => {
    await portfolioPage.goToPortfolio();
    const starredAccountContainer = await portfolioPage.bookmarkedAccountsList();
    starredAccountContainer.waitForDisplayed();

    const starredAccounts = await portfolioPage.getBookmarkedAccounts();
    const firstStarredAccount = starredAccounts[0];
    firstStarredAccount.click();
    await app.client.pause(1000);

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-starred-account",
    });
  });

  it("can toggle discreet mode", async () => {
    await portfolioPage.goToPortfolio();
    const topbarDiscreetButton = await portfolioPage.topbarDiscreetButton();
    await topbarDiscreetButton.click();
    await app.client.pause(1000);

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-discreet-mode",
    });
  });

  it("can collapse the main sidebar", async () => {
    await portfolioPage.goToPortfolio();
    const drawerCollapseButton = await portfolioPage.drawerCollapseButton();
    await drawerCollapseButton.click();

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-collapse-sidebar",
    });
  });

  it("shows the carousel and can dismiss it", async () => {
    await portfolioPage.goToPortfolio();
    const carousel = await portfolioPage.carousel();
    await carousel.waitForDisplayed();

    const carouselDismissButton = await portfolioPage.carouselDismissButton();
    await carouselDismissButton.click();
    await app.client.pause(400);

    const carouselDismissConfirmButton = await portfolioPage.carouselDismissConfirmButton();
    await carouselDismissConfirmButton.click();
    await app.client.pause(400);

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "global-dismiss-carousel",
    });
  });
});
