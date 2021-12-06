import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../models/Layout";
import { Modal } from "../models/Modal";
import { SettingsPage } from "../models/SettingsPage";
import { PasswordlockModal } from "../models/PasswordlockModal";
import { LockscreenPage } from "../models/LockscreenPage";
import * as fs from "fs";

test.use({ userdata: "skip-onboarding" });

test("Enable password lock", async ({ page, userdataFile }) => {
  const layout = new Layout(page);
  const modal = new Modal(page);
  const settingsPage = new SettingsPage(page);
  const passwordlockModal = new PasswordlockModal(page);
  const lockscreenPage = new LockscreenPage(page);

  function getUserdata() {
    const jsonFile = fs.readFileSync(userdataFile, "utf-8");
    return JSON.parse(jsonFile);
  }

  await test.step("Open password lock modal", async () => {
    await settingsPage.goToSettings();
    await passwordlockModal.toggle();
    expect(await passwordlockModal.container.screenshot()).toMatchSnapshot(
      "set-passwordlock-modal.png",
    );
  });

  await test.step("Enable password lock", async () => {
    await passwordlockModal.enablePassword("password", "password");
    expect(await layout.topbarLockButton).toBeVisible();
    expect(await page.screenshot()).toMatchSnapshot("passwordlock-enabled.png");
  });

  await test.step("User data should be encrypted", async () => {
    expect(typeof getUserdata().data.accounts).toBe("string");
  });

  await test.step("Open change password modal", async () => {
    await passwordlockModal.openChangePasswordModal();
    expect(await passwordlockModal.container.screenshot()).toMatchSnapshot(
      "changepassword-modal.png",
    );
  });

  await test.step("Change password", async () => {
    await passwordlockModal.changePassword("password", "newpassword", "newpassword");
    expect(await layout.topbarLockButton).toBeVisible();
  });
  await test.step("Lock app", async () => {
    await layout.lockApp();
    expect(await lockscreenPage.container).toBeVisible();
    expect(await lockscreenPage.logo).toBeVisible();
    expect(await page.screenshot()).toMatchSnapshot("app-locked.png");
  });

  await test.step("I lost my password", async () => {
    await lockscreenPage.lostPassword();
    expect(await modal.container.screenshot()).toMatchSnapshot("lockscreen-reset-app-modal.png");
    await modal.cancel();
  });

  await test.step("Unlock with wrong password", async () => {
    await lockscreenPage.login("wrong");
    expect(await layout.inputError).toBeVisible();
    await page.waitForTimeout(400); // weird 0.4s css transition on error message
    expect(await page.screenshot()).toMatchSnapshot("lockscreen-wrong-password.png");
  });

  await test.step("Unlock with correct password", async () => {
    await lockscreenPage.login("newpassword");
    expect(await lockscreenPage.container).toBeHidden();
    expect(await page.screenshot()).toMatchSnapshot("lockscreen-unlocked.png");
    expect(await layout.topbarLockButton).toBeVisible();
  });

  await test.step("Open disable password lock modal", async () => {
    await passwordlockModal.toggle();
    expect(await modal.container.screenshot()).toMatchSnapshot("disablepassword-modal.png");
  });

  await test.step("Disable password lock: Set wrong password", async () => {
    await passwordlockModal.disablePassword("password");
    expect(await layout.inputError).toBeVisible();
    expect(await layout.topbarLockButton).toBeVisible();
    expect(await modal.container.screenshot()).toMatchSnapshot(
      "passwordlock-disable-bad-password.png",
    );
  });

  await test.step("Disable password lock: Set correct password", async () => {
    await passwordlockModal.disablePassword("newpassword");
    expect(await layout.topbarLockButton).toBeHidden();
    expect(await page.screenshot()).toMatchSnapshot("passwordlock-disabled.png");
  });

  await test.step("User data shouldn't be encrypted", async () => {
    expect(typeof getUserdata().data.accounts).toBe("object");
  });
});
