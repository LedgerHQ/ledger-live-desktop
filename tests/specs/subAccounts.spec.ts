import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { AccountsPage } from "../models/AccountsPage";
import { AddAccountModal } from "../models/AddAccountModal";
import { ReceiveModal } from "../models/ReceiveModal";
import { Layout } from "../models/Layout";
import { DeviceAction } from "../models/DeviceAction";
import { PortfolioPage } from "../models/PortfolioPage";

test.use({ userdata: "skip-onboarding" });

test("subAccounts", async ({ page }) => {
  const addAccountModal = new AddAccountModal(page);
  const accountsPage = new AccountsPage(page);
  const receiveModal = new ReceiveModal(page);
  const deviceAction = new DeviceAction(page);
  const layout = new Layout(page);
  const portfolioPage = new PortfolioPage(page);

  // When parent is missing
  await test.step("should find token in the currencies list", async () => {
    await portfolioPage.openAddAccountModal();
    await addAccountModal.select("chainlink");
    expect(await addAccountModal.container.screenshot()).toMatchSnapshot("subAccount-noParent.png");
  });

  await test.step("should scan parent", async () => {
    await addAccountModal.continue();
    await deviceAction.openApp();
    await addAccountModal.waitForSync();
    expect(await addAccountModal.addAccountsButton).toBeVisible();
  });

  await test.step("should add parent", async () => {
    expect(await addAccountModal.container.screenshot()).toMatchSnapshot(
      "parent-addAccount-result.png",
    );
    await addAccountModal.addAccounts();
    await addAccountModal.done();
  });

  // When parent is present but subAccount is missing
  await test.step("should find token in currencies list", async () => {
    await layout.goToAccounts();
    await accountsPage.openAddAccountModal();
    await addAccountModal.select("must");
    expect(await addAccountModal.container.screenshot()).toMatchSnapshot("parent-exists.png");
  });

  await test.step("should receive on parent", async () => {
    await receiveModal.continue();
    expect(await addAccountModal.container.screenshot()).toMatchSnapshot("select-parent.png");
    await receiveModal.continue();
  });

  await test.step("should show parent address", async () => {
    await receiveModal.skipDevice();
    expect(await addAccountModal.container.screenshot()).toMatchSnapshot("parent-address.png");
    await receiveModal.continue();
    await receiveModal.continue();
  });

  // When subAccount is present
  await test.step("should find token in currencies list", async () => {
    await layout.goToAccounts();
    await accountsPage.openAddAccountModal();
    await addAccountModal.select("usd coin");
    expect(await addAccountModal.container.screenshot()).toMatchSnapshot("subAccount-exist.png");
  });

  await test.step("should receive on subAccount", async () => {
    await receiveModal.continue();
    expect(await addAccountModal.container.screenshot()).toMatchSnapshot("select-account.png");
  });

  await test.step("should show subAccount address", async () => {
    await receiveModal.continue();
    await receiveModal.skipDevice();
    expect(await addAccountModal.container.screenshot()).toMatchSnapshot("subAccount-address.png");
    await receiveModal.continue();
    await receiveModal.continue();
  });
});
