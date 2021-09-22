import Page from "./page";

export default class USBTroubleshootingPage extends Page {
  async startFlowButton() {
    return this.$("#USBTroubleshooting-startFlow");
  }

  async startFromIntroButton() {
    return this.$("#USBTroubleshooting-intro-start");
  }

  async nextSolutionButton() {
    return this.$("#USBTroubleshooting-next");
  }

  async previousSolutionButton() {
    return this.$("#USBTroubleshooting-previous");
  }

  async successButton() {
    return this.$("#USBTroubleshooting-backToManager");
  }

  async deviceNanoSChoiceButton() {
    return this.$("#device-nanoS");
  }

  async deviceNanoXChoiceButton() {
    return this.$("#device-nanoX");
  }

  async deviceBlueChoiceButton() {
    return this.$("#device-blue");
  }

  async startFlow() {
    const startBtn = await this.startFlowButton();
    await startBtn.click();
  }

  async startFromIntro() {
    const startFromIntroBtn = await this.startFromIntroButton();
    await startFromIntroBtn.click();
  }

  async goToNext() {
    const nextBtn = await this.nextSolutionButton();
    await nextBtn.click();
  }

  async goToPrevious() {
    const previousBtn = await this.previousSolutionButton();
    await previousBtn.click();
  }

  async onChooseDevice(deviceId) {
    const deviceBtn =
      deviceId === "nanoS"
        ? await this.deviceNanoSChoiceButton()
        : deviceId === "nanoX"
        ? await this.deviceNanoXChoiceButton()
        : await this.deviceBlueChoiceButton();
    await deviceBtn.click();
  }

  async onSuccess() {
    const successBtn = await this.successButton();
    await successBtn.click();
  }
}
