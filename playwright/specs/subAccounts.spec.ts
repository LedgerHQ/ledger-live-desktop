import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { AccountsPage } from "../models/AccountsPage";
import { AddAccountModal } from "../models/AddAccountModal";
import { ReceiveModal } from "../models/ReceiveModal";
import { Layout } from "../models/Layout";
import { DeviceAction } from "../models/DeviceAction";

test.use({ userdata: "skip-onboarding" });

test("subAccounts", async ({ page }) => {
  const addAccountModal = new AddAccountModal(page);
  const accountsPage = new AccountsPage(page);
  const receiveModal = new ReceiveModal(page);
  const deviceAction = new DeviceAction(page);
  const layout = new Layout(page);

  // When parent is missing
  await test.step("should find token in the currencies list", async () => {
    await addAccountModal.open();
    await addAccountModal.select("chainlink");
    expect(await page.screenshot()).toMatchSnapshot("subAccount-noParent.png");
  });

  await test.step("should scan parent", async () => {
    await addAccountModal.continueParent();
    await deviceAction.openApp();
    expect(addAccountModal.addAccountsButton).toBeVisible();
  });

  await test.step("should add parent", async () => {
    expect(await page.screenshot()).toMatchSnapshot("parent-addAccount-result.png");
    await addAccountModal.addAccounts();
    await addAccountModal.done();
  });

  // When parent is present but subAccount is missing
  await test.step("should find token in currencies list", async () => {
    await layout.goToAccounts();
    await accountsPage.goToAddAccount();
    await addAccountModal.select("must");
    expect(await page.screenshot()).toMatchSnapshot("subAccount-parent-exists.png");
  });

  await test.step("should receive on parent", async () => {
    await addAccountModal.continueParent();
    expect(await page.screenshot()).toMatchSnapshot("select-parent.png");
    await receiveModal.continue();
  });

  await test.step("should show parent address", async () => {
    await receiveModal.skipDevice();
    expect(await page.screenshot()).toMatchSnapshot("parent-address.png");
    await receiveModal.complete();
  });

  // When subAccount is present
  await test.step("should find token in currencies list", async () => {
    await layout.goToAccounts();
    await accountsPage.goToAddAccount();
    await addAccountModal.select("chainlink");
    expect(await page.screenshot()).toMatchSnapshot("subAccount-exist.png");
  });

  await test.step("should receive on subAccount", async () => {
    await addAccountModal.continueParent();
    expect(await page.screenshot()).toMatchSnapshot("select-account.png");
  });

  await test.step("should show subAccount address", async () => {
    await receiveModal.continue();
    await receiveModal.skipDevice();
    expect(await page.screenshot()).toMatchSnapshot("subAccount-address.png");
    await receiveModal.complete();
  });
});
