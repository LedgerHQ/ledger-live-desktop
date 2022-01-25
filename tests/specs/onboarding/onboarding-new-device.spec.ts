import test from "../../fixtures/common";
import { expect } from "@playwright/test";
import { OnboardingPage } from "../../models/OnboardingPage";
import { Modal } from "../../models/Modal";
import { DeviceAction } from "../../models/DeviceAction";

const nanos = ["Nano X", "Nano S", "Blue"];

test.describe.parallel("Onboarding", () => {
  for (const nano of nanos) {
    test(`[${nano}] Onboarding flow new device`, async ({ page }) => {
      const onboardingPage = new OnboardingPage(page);
      const modalPage = new Modal(page);
      const deviceAction = new DeviceAction(page);

      await test.step("Get started", async () => {
        expect(await onboardingPage.getStartedButton).toBeVisible();
        expect(await page.screenshot()).toMatchSnapshot(['common', 'getstarted.png']);
        await onboardingPage.getStarted();
      });

      await test.step("Terms of service", async () => {
        expect(await page.screenshot()).toMatchSnapshot(['common', 'terms.png']);
        await onboardingPage.acceptTerms();
      });

      await test.step(`[${nano}]" Select Device"`, async () => {
        expect(await page.screenshot()).toMatchSnapshot(['common', 'device-selection.png']);
        await onboardingPage.selectDevice(nano);
      });

      await test.step(`[${nano}]" Set Up new"`, async () => {
        expect(await page.screenshot()).toMatchSnapshot(['common', 'onboarding-flows.png']);
        await onboardingPage.newDevice();
      });

      await test.step("Go through Basics Carrousel", async () => {
        expect(await onboardingPage.pedagogyModal.screenshot()).toMatchSnapshot(`carrousel-1.png`);
        await onboardingPage.basicsCarrouselRight();
        expect(await onboardingPage.pedagogyModal.screenshot()).toMatchSnapshot(`carrousel-2.png`);
        await onboardingPage.basicsCarrouselRight();
        expect(await onboardingPage.pedagogyModal.screenshot()).toMatchSnapshot(`carrousel-3.png`);
        await onboardingPage.basicsCarrouselRight();
        expect(await onboardingPage.pedagogyModal.screenshot()).toMatchSnapshot(`carrousel-4.png`);
        await onboardingPage.basicsCarrouselRight();
        expect(await onboardingPage.pedagogyModal.screenshot()).toMatchSnapshot(`carrousel-5.png`);
        await onboardingPage.setupWallet();
        expect(await page.screenshot()).toMatchSnapshot(`setup-wallet`);
      });

      await test.step("Set Up new device", async () => {
        expect(await page.screenshot()).toMatchSnapshot(`start-setup.png`);
        await onboardingPage.startSetup();
        expect(await page.screenshot()).toMatchSnapshot(`set-pincode.png`);
        await onboardingPage.setPincode();
        expect(await page.screenshot()).toMatchSnapshot(`set-passphrase.png`);
        await onboardingPage.setPassphrase();
      });

      await test.step("Pass Quiz", async () => {
        expect(await page.screenshot()).toMatchSnapshot(`start-quiz.png`);
        await onboardingPage.startQuiz();
        expect(await page.screenshot()).toMatchSnapshot(`quiz-first-question.png`);
        await onboardingPage.answerQuizBottom();
        expect(await page.screenshot()).toMatchSnapshot(`quiz-next-question.png`);
        await onboardingPage.quizNextQuestion();
        expect(await page.screenshot()).toMatchSnapshot(`quiz-second-question.png`);
        await onboardingPage.answerQuizBottom();
        expect(await page.screenshot()).toMatchSnapshot(`quiz-next-question-2.png`);
        await onboardingPage.quizNextQuestion();
        expect(await page.screenshot()).toMatchSnapshot(`quiz-third-question.png`);
        await onboardingPage.answerQuizTop();
        expect(await page.screenshot()).toMatchSnapshot(`quiz-next-question-3.png`);
        await onboardingPage.quizNextQuestion();
        expect(await page.screenshot()).toMatchSnapshot(`quiz-success.png`);
        await onboardingPage.quizEnd();
      });

      await test.step(`[${nano}]"Device genuine check"`, async () => {
        expect(await modalPage.container.screenshot()).toMatchSnapshot(['common', `connect-${nano}.png`]);
        await onboardingPage.checkDevice();
        expect(await page.screenshot()).toMatchSnapshot(['common', 'before-genuine-check.png']);
      });

      await test.step("Pass genuine check", async () => {
        await deviceAction.genuineCheck();
        expect(await page.screenshot()).toMatchSnapshot(['common', 'genuine-check-done.png']);
      });

      await test.step("Reach app", async () => {
        await onboardingPage.continue();
        expect(await page.screenshot()).toMatchSnapshot(['common', 'onboarding-complete.png']);
      });
    });
  };
});
