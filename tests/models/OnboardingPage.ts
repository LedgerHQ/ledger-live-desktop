import { Page, Locator } from "@playwright/test";

export class OnboardingPage {
  readonly page: Page;
  readonly getStartedButton: Locator;
  readonly termsCheckbox: Locator;
  readonly termsSubmitButton: Locator;
  readonly selectDeviceButton: Function;
  readonly connectDeviceButton: Locator;
  readonly modalContainer: Locator;
  readonly checkMyNanoButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedButton = page.locator("#onboarding-get-started-button");
    this.termsCheckbox = page.locator("#onboarding-terms-check");
    this.termsSubmitButton = page.locator("#onboarding-terms-submit");
    this.selectDeviceButton = (device: string): Locator =>
      page.locator(`button:has-text("${device}")`);
    this.connectDeviceButton = page.locator("#initialized-device");
    this.modalContainer = page.locator("data-test-id=modal-container");
    this.checkMyNanoButton = page.locator('button:has-text("Check my Nano")');
    this.continueButton = page.locator('button:has-text("Continue")');
    this.firstUseButton = page.locator("#first-use");
    this.leftArrowBasicsButton = page.locator("#pedagogy-left");
    this.rightArrowBasicsButton = page.locator("#pedagogy-right");
    this.setupWalletButton = page.locator("#setup-nano-wallet-cta");
    this.getStartedCtaButton = page.locator("#get-started-cta");
    this.beCarefulButton = page.locator("#be-careful-cta");
    this.startSetupButton = page.locator("#device-howto-cta");
    this.pincodeCheckbox = page.locator("#pincode-private-cb");
    this.setupPincodeButton = page.locator("#device-pincode-cta");
    this.confirmPincodeButton = page.locator("#pincode-howto-cta");
    this.recoveryPhraseCheckbox = page.locator("#recoveryphrase-private-cb");
    this.recoverySetupButton = page.locator("#device-recoveryphrase-cta");
    this.writeRecoveryPhraseButton = page.locator("#use-recovery-sheet");
    this.confirmRecoveryPhraseButton = page.locator("#recovery-howto-3");
    this.hideRecoveryPhraseButton = page.locator("#hide-recovery-cta");
    this.quizStartButton = page.locator("#quizz-start-cta");
    this.quizAnswerTopButton = page.locator("#answer-0");
    this.quizAnswerBottomButton = page.locator("#answer-1");
    this.quizNextButton = page.locator("#quizz-next-cta");
    this.quizSuccessButton = page.locator("#quizz-success-cta");
  }

  async getStarted() {
    await this.getStartedButton.click();
  }

  async acceptTerms() {
    await this.termsCheckbox.click();
    await Promise.all([this.page.waitForResponse("**/*.svg"), this.termsSubmitButton.click()]);
  }

  async selectDevice(device: "Nano S" | "Nano X" | "Blue") {
    await this.selectDeviceButton(device).click();
  }

  async connectDevice() {
    await this.connectDeviceButton.click();
    await this.modalContainer.waitFor({ state: "visible" });
  }

  async newDevice() {
    await this.firstUseButton.click();
  }

  async basicsCarrouselRight() {
    await this.rightArrowBasicsButton.click();
  }

  async startSetup() {
    await this.getStartedCtaButton.click();
    await this.beCarefulButton.click();
    await this.startSetupButton.click();
  }

  async setPincode() {
    await this.pincodeCheckbox.click();
    await this.setupPincodeButton.click();
    await this.confirmPincodeButton.click();
  }

  async setPassphrase() {
    await this.recoveryPhraseCheckbox.click();
    await this.recoverySetupButton.click();
    await this.writeRecoveryPhraseButton.click();
    await this.confirmRecoveryPhraseButton.click();
    await this.hideRecoveryPhraseButton.click();
  }

  async setupWallet() {
    await this.setupWalletButton.click();
  }

  async startQuiz() {
    await this.quizStartButton.click();
  }

  async answerQuizTop() {
    await this.quizAnswerTopButton.click();
  }

  async answerQuizBottom() {
    await this.quizAnswerBottomButton.click();
  }

  async quizNextQuestion() {
    await this.quizNextButton.click();
  }

  async quizEnd() {
    await this.quizSuccessButton.click();
  }

  async checkDevice() {
    await this.checkMyNanoButton.click();
  }

  async continue() {
    await this.continueButton.click();
  }
}
