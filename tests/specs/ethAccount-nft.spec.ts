import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { AccountsPage } from "../models/AccountsPage";
import { AccountPage } from "../models/AccountPage";
import { Layout } from "../models/Layout";
import { NftGalleryPage } from "../models/NftGalleryPage";
import { NftCollectionPage } from "../models/NftCollectionPage";
import { NftDetailsDrawer } from "../models/NftDrawer";

test.use({ userdata: "eth1nft", windowSize: { height: 1200, width: 1024 } });

test("ethereum account with NFTs", async ({ page }) => {
  const layout = new Layout(page);
  const accountsPage = new AccountsPage(page);
  const accountPage = new AccountPage(page);
  const nftGalleryPage = new NftGalleryPage(page);
  const nftCollectionsPage = new NftCollectionPage(page);
  const nftDetailsDrawer = new NftDetailsDrawer(page);

  await test.step("go to account page", async () => {
    await layout.goToAccounts();
    expect(await accountsPage.accountsPageTitle.textContent()).toBe("Accounts");
  });

  await test.step("Ethereum account with NFTs", async () => {
    await accountsPage.openAccount("Ethereum1NFT");
    await page.waitForTimeout(2500);
    expect(await accountPage.accountPageContainer.screenshot()).toMatchSnapshot(
      "eth-account-nft.png",
    );
  });

  await test.step("go to Gallery", async () => {
    await accountPage.goToGallery();
    await page.waitForTimeout(1500);
    expect(await page.screenshot()).toMatchSnapshot("gallery-page-card.png");
  });

  await test.step("show gallery list view", async () => {
    await nftGalleryPage.showListView();
    await page.waitForTimeout(1000);
    expect(await page.screenshot()).toMatchSnapshot("gallery-page-list.png");
  });

  await test.step("display erc721 details", async () => {
    await nftCollectionsPage.openNftDetails("San Fransico - Planet");
    expect(await nftDetailsDrawer.nftDrawerContent.screenshot()).toMatchSnapshot(
      "erc721-details.png",
    );
  });

  await test.step("display erc721 full size", async () => {
    await nftDetailsDrawer.nftImage.click();
    expect(await page.screenshot()).toMatchSnapshot("erc721-full.png");
    await page.keyboard.press("Escape");
  });

  await test.step("display nft collection", async () => {
    await layout.goToAccounts();
    await accountsPage.openAccount("Ethereum1NFT");
    await accountPage.openCollection("OpenSea Shared Storefront");
    await page.waitForTimeout(1000);
    expect(await page.screenshot()).toMatchSnapshot("collection-page.png");
  });

  await test.step("display erc1155 details", async () => {
    await nftCollectionsPage.openNftDetails("GodEye #400");
    expect(await nftDetailsDrawer.nftDrawerContent.screenshot()).toMatchSnapshot(
      "erc1155-details.png",
    );
  });

  await test.step("display external links popup", async () => {
    await nftDetailsDrawer.externalLinksButton.click();
    expect(await nftDetailsDrawer.nftDrawerContent.screenshot()).toMatchSnapshot(
      "nft-external-links.png",
    );
  });

  await test.step("display erc1155 full size", async () => {
    await nftDetailsDrawer.nftImage.click();
    expect(await page.screenshot()).toMatchSnapshot("erc1155-full.png");
  });
});
