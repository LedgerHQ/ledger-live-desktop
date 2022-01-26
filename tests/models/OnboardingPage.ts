import { Page, Locator } from "@playwright/test";

export class OnboardingPage {
  readonly page: Page;
  readonly getStartedButton: Locator;
  readonly termsCheckbox: Locator;
  readonly termsSubmitButton: Locator;
  readonly selectDeviceButton: Function;
  readonly newDeviceButton: Locator;
  readonly connectDeviceButton: Locator;
  readonly restoreDeviceButton: Locator;
  readonly pedagogyModal: Locator;
  readonly checkMyNanoButton: Locator;
  readonly continueButton: Locator;
  readonly leftArrowBasicsButton: Locator;
  readonly rightArrowBasicsButton: Locator;
  readonly setupWalletButton: Locator;
  readonly getStartedCtaButton: Locator;
  readonly beCarefulButton: Locator;
  readonly startSetupButton: Locator;
  readonly pincodeCheckbox: Locator;
  readonly setupPincodeButton: Locator;
  readonly confirmPincodeButton: Locator;
  readonly recoveryPhraseCheckbox: Locator;
  readonly recoverySetupButton: Locator;
  readonly writeRecoveryPhraseButton: Locator;
  readonly confirmRecoveryPhraseButton: Locator;
  readonly hideRecoveryPhraseButton: Locator;
  readonly quizContainer: Locator;
  readonly quizStartButton: Locator;
  readonly quizAnswerTopButton: Locator;
  readonly quizAnswerBottomButton: Locator;
  readonly quizNextButton: Locator;
  readonly quizSuccessButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedButton = page.locator("data-test-id=onboarding-get-started-button");
    this.termsCheckbox = page.locator("data-test-id=onboarding-terms-checkbox");
    this.termsSubmitButton = page.locator("data-test-id=onboarding-terms-submit");
    this.selectDeviceButton = (device: string): Locator =>
      page.locator(`button:has-text("${device}")`);
    this.checkMyNanoButton = page.locator('button:has-text("Check my Nano")');
    this.continueButton = page.locator('button:has-text("Continue")');
    this.newDeviceButton = page.locator("data-test-id=onboarding-new-device");
    this.connectDeviceButton = page.locator("data-test-id=onboarding-initialized-device");
    this.restoreDeviceButton = page.locator("data-test-id=onboarding-restore-device");
    this.pedagogyModal = page.locator("data-test-id=onboarding-pedagogy-modal");
    this.leftArrowBasicsButton = page.locator("data-test-id=pedagogy-left");
    this.rightArrowBasicsButton = page.locator("data-test-id=pedagogy-right");
    this.setupWalletButton = page.locator("data-test-id=setup-nano-wallet-cta");
    this.getStartedCtaButton = page.locator("data-test-id=get-started-cta");
    this.beCarefulButton = page.locator("data-test-id=be-careful-cta");
    this.startSetupButton = page.locator("data-test-id=device-howto-cta");
    this.pincodeCheckbox = page.locator("data-test-id=pincode-private-cb");
    this.setupPincodeButton = page.locator("data-test-id=device-pincode-cta");
    this.confirmPincodeButton = page.locator("data-test-id=pincode-howto-cta");
    this.recoveryPhraseCheckbox = page.locator("data-test-id=recoveryphrase-private-cb");
    this.recoverySetupButton = page.locator("data-test-id=device-recoveryphrase-cta");
    this.writeRecoveryPhraseButton = page.locator("data-test-id=use-recovery-sheet");
    this.confirmRecoveryPhraseButton = page.locator("data-test-id=recovery-howto-3");
    this.hideRecoveryPhraseButton = page.locator("data-test-id=hide-recovery-cta");
    this.quizContainer = page.locator("data-test-id=quiz-container");
    this.quizStartButton = page.locator("data-test-id=quiz-start-cta");
    this.quizAnswerTopButton = page.locator("data-test-id=quiz-answer-0");
    this.quizAnswerBottomButton = page.locator("data-test-id=quiz-answer-1");
    this.quizNextButton = page.locator("data-test-id=quiz-next-cta");
    this.quizSuccessButton = page.locator("data-test-id=quiz-success-cta");
  }

  async getStarted() {
    await this.getStartedButton.click();
  }

  async acceptTerms() {
    await this.termsCheckbox.click();
    await this.termsSubmitButton.click();
  }

  async selectDevice(device: "Nano S" | "Nano X" | "Blue" | string) {
    await this.selectDeviceButton(device).click();
  }

  async connectDevice() {
    await this.connectDeviceButton.click();
  }

  async newDevice() {
    await this.newDeviceButton.click();
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
