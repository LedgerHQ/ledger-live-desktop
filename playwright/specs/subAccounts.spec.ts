import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { AccountModal } from "../models/AccountModal";
import { DeviceAction } from "../models/DeviceAction";
import { ReceiveModal } from "../models/ReceiveModal";
import { SidebarMenu } from "../models/SidebarMenu";

test.use({ userdata: "skip-onboarding" });

test("Sub-Accounts", async ({ page }) => {
  const accountModal = new AccountModal(page);
  const receiveModal = new ReceiveModal(page);
  const deviceAction = new DeviceAction(page);
  const sidebar = new SidebarMenu(page);

  // When parent is missing
  await test.step("should find token in the currencies list", async () => {
    await accountModal.open();
    await accountModal.selectCurrency("chainlink");
    expect(await page.screenshot()).toMatchSnapshot("subAccount-noParent.png");
  });

  await test.step("should scan parent", async () => {
    await accountModal.continueParent();
    await deviceAction.openApp();
    expect(accountModal.addAccountsButton).toBeVisible();
  });

  await test.step("should add parent", async () => {
    expect(await page.screenshot()).toMatchSnapshot("chainlink-addAccount-result.png");
    await accountModal.complete();
  });

  // When parent is present but subAccount is missing
  await test.step("should find token in the currencies list", async () => {
    await sidebar.navigate("accounts");
    await accountModal.open();
    await accountModal.selectCurrency("must");
    expect(await page.screenshot()).toMatchSnapshot("subAccount-parent-exist.png");
  });

  await test.step("should receive on parent", async () => {
    await accountModal.continueParent();
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
    await accountModal.navigate();
    await accountModal.open();
    await accountModal.selectCurrency("chainlink");
    expect(await page.screenshot()).toMatchSnapshot("subAccount-exist.png");
  });

  await test.step("should receive on subAccount", async () => {
    await accountModal.continueParent();
    expect(await page.screenshot()).toMatchSnapshot("select-subAccount.png");
  });

  await test.step("should show subAccount address", async () => {
    await receiveModal.continue();
    await receiveModal.skipDevice();
    expect(await page.screenshot()).toMatchSnapshot("subAccount-address.png");
    await receiveModal.complete();
  });
});
