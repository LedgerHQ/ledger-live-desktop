import Modal from "./modal.page";

export default class AddAccountModal extends Modal {
  get importAddButton() {
    return this.$("#add-accounts-import-add-button");
  }

  async addAccountFlow(currency, mockDeviceEvent) {
    const container = await this.container;
    const selectControl = await container.$(".select__control");
    await selectControl.click();

    const input = await selectControl.$("input");
    await input.addValue(currency);
    const firstOption = await this.$(".select-options-list .option:first-child");
    await firstOption.click();

    const continueBtn = await this.continueButton;
    await continueBtn.click();

    await mockDeviceEvent({ type: "opened" });
    const importBtn = await this.importAddButton;
    await importBtn.waitForDisplayed();
    await importBtn.waitForEnabled();
    await importBtn.click();
  }
}
