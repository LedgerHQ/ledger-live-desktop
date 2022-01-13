import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../models/Layout";
import { AccountsPage } from "../models/AccountsPage";
import { PortfolioPage } from "../models/PortfolioPage";
import { DeviceAction } from "../models/DeviceAction";

test.use({ userdata: "2AccountsETHRenamed" });

test("Check Ethereum accounts", async ({ page }) => {
  const layout = new Layout(page);
  const accountsPage = new AccountsPage(page);

  await test.step("When user add ETH accounts", async () => {
    await layout.goToAccounts();
    expect(await accountsPage.accountsPageTitle.textContent()).toBe("Accounts");
  });

  await test.step("Ethereum account with NFTs", async () => {
    await accountsPage.openAccount("Ethereum1NFT");
    expect(await page.screenshot()).toMatchSnapshot("eth-account-nft.png");
  });
});
