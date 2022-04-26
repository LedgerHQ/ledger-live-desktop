import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { ManagerPage } from "../models/ManagerPage";
import { DeviceAction } from "../models/DeviceAction";

test.use({ userdata: "skip-onboarding" });

test("Manager", async ({ page }) => {
  const managerPage = new ManagerPage(page);
  const deviceAction = new DeviceAction(page);

  await test.step("can access manager", async () => {
    await managerPage.navigate();
    await deviceAction.accessManager();
    await managerPage.firmwareUpdateButton.waitFor({ state: "visible" });
    expect(await page.screenshot()).toMatchSnapshot({
      name: "manager-app-catalog.png",
    });
  });

  await test.step("can install an app", async () => {
    await managerPage.installApp("Tron");
    expect(await page.screenshot()).toMatchSnapshot({
      name: "manager-install-tron.png",
    });
  });

  await test.step("can access installed apps tab", async () => {
    await managerPage.goToInstalledAppTab();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "manager-installed-apps.png",
    });
  });

  await test.step("can uninstall an app", async () => {
    await managerPage.uninstallApp("Tron");
    expect(await page.screenshot()).toMatchSnapshot({
      name: "manager-uninstall-tron.png",
    });
  });

  await test.step("can update all apps", async () => {
    await managerPage.goToCatalogTab();
    await managerPage.updateAllApps();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "manager-updateAll.png",
    });
  });

  await test.step("can uninstall all apps", async () => {
    await managerPage.goToInstalledAppTab();
    await managerPage.uninstallAllApps();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "manager-uninstallAll.png",
    });
  });
});
