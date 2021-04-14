import Modal from "./modal.page";

export default class ReceiveModalPage extends Modal {
  async receiveContinueButton() {
    return this.$("#receive-account-continue-button");
  }

  async receiveSkipDeviceButton() {
    return this.$("#receive-connect-device-skip-device-button");
  }

  async receiveVerifyAddressButton() {
    return this.$("#receive-verify-address-button");
  }

  async receiveSkipDevice() {
    const continueBtn = await this.receiveContinueButton();
    await continueBtn.click();
    const skipDeviceBtn = await this.receiveSkipDeviceButton();
    await skipDeviceBtn.click();
    const verifyAddressBtn = await this.receiveVerifyAddressButton();
    await verifyAddressBtn.waitForDisplayed();
  }
}
