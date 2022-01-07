import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../models/Layout";
import { AccountsPage } from "../models/AccountsPage";
import { PortfolioPage } from "../models/PortfolioPage";
import { AddAccountModal } from "../models/AddAccountModal";
import { DeviceAction } from "../models/DeviceAction";
import { child } from "winston";

test.use({ userdata: "skip-onboarding" });

test("Check Ethereum accounts", async ({ page }) => {
  const layout = new Layout(page);
  const accountsPage = new AccountsPage(page);
  const portfolioPage = new PortfolioPage(page);
  const addAccountModal = new AddAccountModal(page);
  const deviceAction = new DeviceAction(page);

  await test.step("When user add ETH accounts", async () => {
    await portfolioPage.openAddAccountModal();
    await addAccountModal.select("Ethereum");
    await addAccountModal.continue();
    await deviceAction.openApp();
    await addAccountModal.waitForSync();
    await addAccountModal.addAccounts();
    await addAccountModal.done();
    await layout.goToAccounts();
    expect(await accountsPage.accountsPageTitle.textContent()).toBe("Accounts");
  });

  await test.step("Ethereum account with NFTs", async () => {
    await accountsPage.openAccount();
    expect(await page.screenshot()).toMatchSnapshot("eth-account-nft.png");
  });
});
