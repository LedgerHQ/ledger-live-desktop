import Modal from "./modal.page";

export default class AddAccountModal extends Modal {
  get importAddButton() {
    return this.$("#add-accounts-import-add-button");
  }

  async prepareAddAccount(currency) {
    const container = await this.container;
    const selectControl = await container.$(".select__control");
    await selectControl.click();

    const input = await selectControl.$("input");
    await this.app.client.pause(600);
    await input.addValue(currency);
    await this.app.client.pause(300);
    const firstOption = await this.$(".select-options-list .option:first-child");
    await firstOption.click();
  }

  async finishAddAccount(mockDeviceEvent) {
    const continueBtn = await this.continueButton;
    await continueBtn.click();

    await mockDeviceEvent({ type: "opened" });
    const importBtn = await this.importAddButton;
    await importBtn.waitForDisplayed();
    await importBtn.waitForEnabled();
    await importBtn.click();
  }
}
