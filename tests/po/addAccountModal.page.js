import Modal from "./modal.page";

export default class AddAccountModal extends Modal {
  get importAddButton() {
    return this.$("#add-accounts-import-add-button");
  }

  // DEPRECATED ?
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

  async prepareAddAccount(currency) {
    const container = await this.container;
    const selectControl = await container.$(".select__control");
    await selectControl.click();

    const input = await selectControl.$("input");
    await input.addValue(currency);
  }

  async finishAddAccount(mockDeviceEvent) {
    let i = 0;
    // ugly hack
    while (
      !(await this.app.client.isExisting(".select-options-list .option:first-child")) &&
      i < 3
    ) {
      i++;
      await this.app.client.pause(1000);
    }
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
