import Modal from "./modal.page";

export default class AddAccountModal extends Modal {
  async importAddButton() {
    return this.$("#add-accounts-import-add-button");
  }

  async prepareAddAccount(currency) {
    const container = await this.container();
    const selectControl = await container.$(".select__control");
    await selectControl.click();

    const input = await selectControl.$("input");
    await input.setValue(currency);
    await this.app.client.keys(["Enter"]);
  }

  async finishAddAccount(mockDeviceEvent) {
    const continueBtn = await this.continueButton();
    await continueBtn.click();

    await mockDeviceEvent({ type: "opened" });
    const importBtn = await this.importAddButton();
    await importBtn.waitForDisplayed();
    await importBtn.waitForEnabled();
    await importBtn.click();
  }
}
