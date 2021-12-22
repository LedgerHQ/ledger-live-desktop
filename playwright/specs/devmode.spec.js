import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../models/Layout";
import { Modal } from "../models/Modal";
import { AddAccountModal } from "../models/AddAccountModal";
import { SettingsPage } from "../models/SettingsPage";
import { PortfolioPage } from "../models/PortfolioPage";

test.use({ userdata: "skip-onboarding" });

test("Enable dev mode from settings", async page => {
  const layout = new Layout(page);
  const modal = new Modal(page);
  const addAccountModal = new AddAccountModal(page);
  const settingsPage = new SettingsPage(page);
  const portfolioPage = new PortfolioPage(page);

  await test.step("when devMode OFF -> Testnet currencies shouldn't be available", async () => {
    await portfolioPage.openAddAccountModal();
    await addAccountModal.select("testnet");
    expect(await page.screenshot()).toMatchSnapshot("empty-result.png");
    await this.selectAccountInput.press("Escape");
  });

  await test.step("User should be able to enable devMode", async () => {
    await layout.goToSettings();
    await settingsPage.goToExperimentalTab();
    await settingsPage.enableDevMode();
    expect(await page.screenshot()).toMatchSnapshot("devMode-on.png");
  });
});
