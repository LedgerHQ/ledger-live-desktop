import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { ManagerPage } from "../models/ManagerPage";
import { FirmwareUpdateModal } from "../models/FirmwareUpdateModal";
import { DeviceAction } from "../models/DeviceAction";

test.use({ userdata: "skip-onboarding" });

test("Firmware Update", async ({ page }) => {
  const managerPage = new ManagerPage(page);
  const firmwareUpdateModal = new FirmwareUpdateModal(page);
  const deviceAction = new DeviceAction(page);

  await test.step("access manager", async () => {
    await managerPage.goToManager();
    await deviceAction.accessManager();
    await managerPage.firmwareUpdateButton.waitFor({ state: "visible" });
    expect(await page.screenshot()).toMatchSnapshot({
      name: "manager-page.png",
    });
  });

  await test.step("firmware update flow-2", async () => {
    await managerPage.openFirmwareUpdateModal();
    expect(await firmwareUpdateModal.container.screenshot()).toMatchSnapshot({
      name: "firmware-update-button.png",
    });
  });

  await test.step("firmware update flow-3", async () => {
    await firmwareUpdateModal.tickCheckbox();
    expect(await firmwareUpdateModal.container.screenshot()).toMatchSnapshot({
      name: "modal-checkbox.png",
    });
  });

  await test.step("firmware update flow-5", async () => {
    await firmwareUpdateModal.continue();
    await firmwareUpdateModal.downloadProgress.waitFor({ state: "visible" });
    expect(await firmwareUpdateModal.container.screenshot()).toMatchSnapshot({
      name: "download-mcu-progress.png",
    });
  });

  await test.step("firmware update flow-6", async () => {
    await deviceAction.complete(); // .complete() install full firmware -> flash mcu
    await firmwareUpdateModal.flashProgress.waitFor({ state: "visible" });
    expect(await firmwareUpdateModal.container.screenshot()).toMatchSnapshot({
      name: "flash-mcu-progress.png",
    });
  });

  await test.step("firmware update flow-7", async () => {
    await deviceAction.complete(); // .complete() flash mcu -> completed
    await firmwareUpdateModal.updateDone.waitFor({ state: "visible" });
    expect(await firmwareUpdateModal.container.screenshot()).toMatchSnapshot({
      name: "flash-mcu-done.png",
    });
  });

  await test.step("firmware update flow-8", async () => {
    await firmwareUpdateModal.close();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "modal-closed.png",
    });
  });
});
