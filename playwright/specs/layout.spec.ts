import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../models/Layout";
import { SendModal } from "../models/SendModal";
import { ReceiveModal } from "../models/ReceiveModal";
import { PortfolioPage } from "../models/PortfolioPage";
import { AccountPage } from "../models/AccountPage";

test.use({ userdata: "1AccountBTC1AccountETHStarred" });

test("Layout", async ({ page }) => {
  const layout = new Layout(page);
  const sendModal = new SendModal(page);
  const receiveModal = new ReceiveModal(page);
  const portfolioPage = new PortfolioPage(page);
  const accountPage = new AccountPage(page);

  await test.step("can open send modal", async () => {
    await layout.openSendModal();
    await sendModal.container.waitFor({ state: "visible" });
    expect(await page.screenshot()).toMatchSnapshot("send-modal.png");
    await sendModal.close();
  });

  await test.step("can open receive modal", async () => {
    await layout.openReceiveModal();
    await receiveModal.container.waitFor({ state: "visible" });
    expect(await page.screenshot()).toMatchSnapshot("receive-modal.png");
    await receiveModal.close();
  });

  await test.step("go to buy / sell cryto", async () => {
    await layout.drawerExperimentalButton.click();
    expect(await page.screenshot()).toMatchSnapshot("experimental-features.png");
  });

  await test.step("shows a starred account, and can access the page", async () => {
    expect(await layout.bookmarkedAccounts.count()).toBe(1);
    await layout.bookmarkedAccounts.first().click();
    // expect(await accountPage.buttonsGroup).toHaveCSS("opacity", "1");
    // expect(await page.screenshot()).toMatchSnapshot("bookmarked-account-link.png");
    // FIXME: even if opacity = 1, screenshot is flaky
    await expect(page).toHaveURL(/.*\/account\/.*/);
  });

  await test.step("can toggle discreet mode", async () => {
    await layout.topbarDiscreetButton.click();
    expect(await page.screenshot()).toMatchSnapshot("discreet-mode.png");
  });

  await test.step("can collapse the main sidebar", async () => {
    await layout.drawerCollapseButton.click();
    expect(await page.screenshot()).toMatchSnapshot("collapse-sidebar.png");
  });

  await test.step("shows the carousel and can dismiss it", async () => {
    await layout.goToPortfolio();
    await portfolioPage.carousel.waitFor({ state: "visible" });
    await portfolioPage.carouselCloseButton.click();
    await portfolioPage.carouselConfirmButton.click();
    expect(await page.screenshot()).toMatchSnapshot("dismiss-carousel.png");
  });

  await test.step("can display the help modal", async () => {
    await layout.topbarHelpButton.click();
    expect(await page.screenshot()).toMatchSnapshot("help-drawer.png");
  });
});
