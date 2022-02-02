import test from "../fixtures/common";
import { expect } from "@playwright/test";
import { ManagerPage } from "../models/ManagerPage";
import { FirmwareUpdateModal } from "../models/FirmwareUpdateModal";
import { DeviceAction } from "../models/DeviceAction";
import { Layout } from "../models/Layout";

test.use({ userdata: "skip-onboarding" });

test("Firmware Update", async ({ page }) => {
  const managerPage = new ManagerPage(page);
  const firmwareUpdateModal = new FirmwareUpdateModal(page);
  const deviceAction = new DeviceAction(page);
  const layout = new Layout(page);

  await test.step("Access manager", async () => {
    await layout.goToManager();
    await deviceAction.accessManager();
    await managerPage.firmwareUpdateButton.waitFor({ state: "visible" });
  });

  await test.step("Open firmware update modal", async () => {
    await managerPage.openFirmwareUpdateModal();
    expect(await firmwareUpdateModal.container.screenshot()).toMatchSnapshot({
      name: "firmware-update-button.png",
    });
  });

  await test.step("Firmware update changelog", async () => {
    await firmwareUpdateModal.tickCheckbox();
    expect(await firmwareUpdateModal.container.screenshot()).toMatchSnapshot({
      name: "modal-checkbox.png",
    });
  });

  await test.step("MCU download step", async () => {
    await firmwareUpdateModal.continue();
    await firmwareUpdateModal.downloadProgress.waitFor({ state: "visible" });
    expect(await firmwareUpdateModal.container.screenshot()).toMatchSnapshot({
      name: "download-mcu-progress.png",
    });
  });

  await test.step("MCU flash step", async () => {
    await deviceAction.complete(); // .complete() install full firmware -> flash mcu
    await firmwareUpdateModal.flashProgress.waitFor({ state: "visible" });
    expect(await firmwareUpdateModal.container.screenshot()).toMatchSnapshot({
      name: "flash-mcu-progress.png",
    });
  });

  await test.step("Firmware update done", async () => {
    await deviceAction.complete(); // .complete() flash mcu -> completed
    await firmwareUpdateModal.updateDone.waitFor({ state: "visible" });
    expect(await firmwareUpdateModal.container.screenshot()).toMatchSnapshot({
      name: "flash-mcu-done.png",
    });
  });

  await test.step("Modal is closed", async () => {
    await firmwareUpdateModal.close();
    expect(await page.screenshot()).toMatchSnapshot({
      name: "modal-closed.png",
    });
  });
});
