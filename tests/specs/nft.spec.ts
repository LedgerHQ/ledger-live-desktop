import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../models/Layout";
import { AccountsPage } from "../models/AccountsPage";
import { AccountPage } from "../models/AccountPage";
import { NftGalleryPage } from "../models/nftGalleryPage";
import { PortfolioPage } from "../models/PortfolioPage";
import { DeviceAction } from "../models/DeviceAction";

test.use({ userdata: "2AccountsETHRenamed" });

test("Check Ethereum accounts", async ({ page }) => {
  const layout = new Layout(page);
  const accountsPage = new AccountsPage(page);
  const accountPage = new AccountPage(page);
  const nftGalleryPage = new NftGalleryPage(page);

  await test.step("Go to accounts page", async () => {
    await layout.goToAccounts();
    expect(await accountsPage.accountsPageTitle.textContent()).toBe("Accounts");
  });

  await test.step("Ethereum account with NFTs", async () => {
    await accountsPage.openAccount("Ethereum1NFT");
    // TODO: Need to find a way to grow the window size as vieport is not working
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot("eth-account-nft.png");
  });

  await test.step("Go to Gallery", async () => {
    await accountPage.goToGallery();
    expect(await page.screenshot()).toMatchSnapshot("gallery-list.png");
  });

  await test.step("Show card view", async () => {
    await nftGalleryPage.showGridView();
    expect(await page.screenshot()).toMatchSnapshot("gallery-cards.png");
  });
});
