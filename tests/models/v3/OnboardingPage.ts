import { Page, Locator, expect } from "@playwright/test";
import { DeviceAction } from "../DeviceAction";

export class OnboardingPage {
  readonly page: Page;
  readonly deviceAction: DeviceAction;
  readonly getStartedButton: Locator;
  readonly termsAndConditionsPopin: Locator;
  readonly termsOfUseCheckbox: Locator;
  readonly privacyPolicyCheckbox: Locator;
  readonly termsAndConditionsButton: Locator;
  readonly selectDeviceContainer: Function;
  readonly selectDeviceButton: Function;
  readonly newDeviceButton: Locator;
  readonly connectDeviceButton: Locator;
  readonly restoreDeviceButton: Locator;
  readonly pedagogyModal: Locator;
  readonly stepperContinueButton: Locator;
  readonly stepperEndButton: Locator;
  readonly checkMyNanoButton: Locator;
  readonly gotItButton: Locator;
  readonly continueButton: Locator;
  readonly leftArrowBasicsButton: Locator;
  readonly rightArrowBasicsButton: Locator;
  readonly tutorialContinueButton: Locator;
  readonly setupWalletButton: Locator;
  readonly getStartedCtaButton: Locator;
  readonly beCarefulButton: Locator;
  readonly startSetupButton: Locator;
  readonly pinCodeCheckbox: Locator;
  readonly setupPincodeButton: Locator;
  readonly confirmPincodeButton: Locator;
  readonly recoveryPhraseCheckbox: Locator;
  readonly recoveryPhraseLossCheckbox: Locator;
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
    this.deviceAction = new DeviceAction(page);
    this.getStartedButton = page.locator("data-test-id=v3-onboarding-get-started-button");
    this.termsAndConditionsPopin = page.locator(
      "data-test-id=v3-onboarding-terms-and-conditions-popin",
    );
    this.termsOfUseCheckbox = page.locator("data-test-id=v3-onboarding-terms-checkbox");
    this.privacyPolicyCheckbox = page.locator("data-test-id=v3-onboarding-privacy-checkbox");
    this.termsAndConditionsButton = page.locator(
      "data-test-id=v3-onboarding-terms-and-conditions-button",
    );
    this.selectDeviceContainer = (deviceId: string): Locator => {
      return page.locator(`data-test-id=v3-container-device-${deviceId}`);
    };
    this.selectDeviceButton = (deviceId: string): Locator =>
      page.locator(`data-test-id=v3-device-${deviceId}`);
    this.checkMyNanoButton = page.locator('button:has-text("Check my Nano")');
    this.gotItButton = page.locator('button:has-text("Got it")');
    this.continueButton = page.locator('button:has-text("Continue")');
    this.newDeviceButton = page.locator("data-test-id=v3-onboarding-new-device");
    this.connectDeviceButton = page.locator("data-test-id=v3-onboarding-initialized-device");
    this.restoreDeviceButton = page.locator("data-test-id=v3-onboarding-restore-device");
    this.pedagogyModal = page.locator("data-test-id=v3-onboarding-pedagogy-modal");
    this.stepperContinueButton = page.locator("data-test-id=v3-modal-stepper-continue");
    this.stepperEndButton = page.locator("data-test-id=v3-modal-stepper-end");
    this.leftArrowBasicsButton = page.locator("data-test-id=v3-pedagogy-left");
    this.rightArrowBasicsButton = page.locator("data-test-id=v3-pedagogy-right");
    this.tutorialContinueButton = page.locator("data-test-id=v3-tutorial-continue");
    this.setupWalletButton = page.locator("data-test-id=v3-setup-nano-wallet-cta");
    this.getStartedCtaButton = page.locator("data-test-id=v3-get-started-cta");
    this.beCarefulButton = page.locator("data-test-id=v3-be-careful-cta");
    this.startSetupButton = page.locator("data-test-id=v3-device-howto-cta");
    this.pinCodeCheckbox = page.locator("data-test-id=v3-private-pin-code-checkbox");
    this.recoveryPhraseCheckbox = page.locator("data-test-id=v3-recovery-phrase-checkbox");
    this.recoveryPhraseLossCheckbox = page.locator("data-test-id=v3-recovery-phrase-loss-checkbox");
    this.recoverySetupButton = page.locator("data-test-id=v3-device-recoveryphrase-cta");
    this.writeRecoveryPhraseButton = page.locator("data-test-id=v3-use-recovery-sheet");
    this.confirmRecoveryPhraseButton = page.locator("data-test-id=v3-recovery-howto-3");
    this.hideRecoveryPhraseButton = page.locator("data-test-id=v3-hide-recovery-cta");
    this.quizContainer = page.locator("data-test-id=v3-quiz-container");
    this.quizStartButton = page.locator("data-test-id=v3-quiz-start-button");
    this.quizAnswerTopButton = page.locator("data-test-id=v3-quiz-answer-0");
    this.quizAnswerBottomButton = page.locator("data-test-id=v3-quiz-answer-1");
    // this.quizNextButton = page.locator("data-test-id=v3-quiz-next-cta");
    // this.quizSuccessButton = page.locator("data-test-id=v3-quiz-success-cta");
  }

  async getStarted() {
    await this.getStartedButton.waitFor({ state: "visible" });
    expect(await this.page.screenshot()).toMatchSnapshot("v3-get-started.png");
    await this.getStartedButton.click();
  }

  async acceptTermsAndConditions() {
    expect(await this.page.screenshot()).toMatchSnapshot("v3-terms-1.png");
    await this.page.check('input[name="termsOfUseCheckbox"]');
    await this.page.check('input[name="privacyPolicyCheckbox"]');
    expect(await this.page.screenshot()).toMatchSnapshot("v3-terms-2.png");
    await this.termsAndConditionsButton.click();
  }

  async selectDevice(device: "nanoS" | "nanoX" | "nanoSPlus") {
    expect(await this.page.screenshot()).toMatchSnapshot("v3-device-selection.png");
    await this.page.hover(`[data-test-id=v3-container-device-${device}]`);
    await this.selectDeviceButton(device).click();
  }

  async beCareful() {
    expect(await this.page.screenshot()).toMatchSnapshot("v3-be-careful.png");
    await this.gotIt();
  }

  async warnings() {
    await this.beCareful();
    expect(await this.page.screenshot()).toMatchSnapshot("v3-recovery-warning.png");
    await this.continue();
  }

  async connectDevice() {
    await this.connectDeviceButton.click();
    // await this.page.click("data-test-id=v3-onboarding-initialized-device");
  }

  async newDevice() {
    await this.newDeviceButton.click();
  }

  async restoreDevice() {
    await this.restoreDeviceButton.click();
  }

  // async basicsCarrouselContinue() {
  //   await this.page.click('button:has-text("Continue")');
  // }

  async pedagogyContinue() {
    await this.stepperContinueButton.click();
  }

  async pedagogyEnd() {
    await this.stepperEndButton.click();
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

  async continueTutorial() {
    await this.tutorialContinueButton.click();
  }

  async acceptPrivatePinCode() {
    await this.pinCodeCheckbox.click();
  }

  async acceptRecoveryPhrase() {
    await this.recoveryPhraseCheckbox.click();
  }

  async acceptRecoveryPhraseLoss() {
    await this.recoveryPhraseLossCheckbox.click();
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
    await this.stepperContinueButton.click();
  }

  async quizEnd() {
    await this.stepperEndButton.click();
  }

  async checkDevice() {
    expect(await this.page.screenshot()).toMatchSnapshot("v3-genuine-check.png");
    await this.checkMyNanoButton.click();
    expect(await this.page.screenshot()).toMatchSnapshot("v3-before-genuine-check.png");
  }

  async genuineCheck() {
    expect(await this.page.screenshot()).toMatchSnapshot("v3-genuine-checking.png");
    await this.deviceAction.genuineCheck();
    expect(await this.page.screenshot()).toMatchSnapshot("v3-genuine-check-done.png");
  }

  async continue() {
    await this.continueButton.click();
  }

  async gotIt() {
    await this.gotItButton.click();
  }

  async reachApp() {
    await this.continue();
    expect(await this.page.screenshot()).toMatchSnapshot("v3-onboarding-complete.png");
  }
}
