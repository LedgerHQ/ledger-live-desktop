import test from "../../../fixtures/common";
import { expect } from "@playwright/test";
import { OnboardingPage } from "../../../models/v3/OnboardingPage";

enum Nano {
  nanoX = "nanoX",
  nanoS = "nanoS",
  nanoSP = "nanoSPlus",
}

const nanos = [Nano.nanoX, Nano.nanoS, Nano.nanoSP];

test.describe.parallel("Onboarding", () => {
  for (const nano of nanos) {
    test(`[${nano}] Onboarding flow new device`, async ({ page }) => {
      const onboardingPage = new OnboardingPage(page);

      await test.step("Get started", async () => {
        await onboardingPage.getStarted();
      });

      await test.step("Terms of service", async () => {
        await onboardingPage.acceptTermsAndConditions();
      });

      await test.step(`[${nano}] Select Device`, async () => {
        if (nano !== Nano.nanoSP) {
          await onboardingPage.selectDevice(nano);
        }
      });

      await test.step(`[${nano}]" Set up new"`, async () => {
        if (nano !== Nano.nanoSP) {
          expect(await page.screenshot()).toMatchSnapshot(`v3-device-setup-${nano}.png`);
          await onboardingPage.newDevice();
          await onboardingPage.beCareful();
        }
      });

      await test.step("Pedagogy", async () => {
        if (nano !== Nano.nanoSP) {
          await onboardingPage.pedagogyModal.waitFor({ state: "visible" });
          await onboardingPage.page.waitForSelector("data-test-id=v3-onboarding-pedagogy-modal");
          expect(await onboardingPage.pedagogyModal.screenshot()).toMatchSnapshot([
            "v3-pedagogy",
            "access-your-crypto.png",
          ]);
          await onboardingPage.pedagogyContinue();

          expect(await onboardingPage.pedagogyModal.screenshot()).toMatchSnapshot([
            "v3-pedagogy",
            "own-your-private-key.png",
          ]);
          await onboardingPage.pedagogyContinue();

          expect(await onboardingPage.pedagogyModal.screenshot()).toMatchSnapshot([
            "v3-pedagogy",
            "stay-offline.png",
          ]);
          await onboardingPage.pedagogyContinue();

          expect(await onboardingPage.pedagogyModal.screenshot()).toMatchSnapshot([
            "v3-pedagogy",
            "validate-transactions.png",
          ]);
          await onboardingPage.pedagogyContinue();

          expect(await onboardingPage.pedagogyModal.screenshot()).toMatchSnapshot([
            "v3-pedagogy",
            "lets-set-up-your-nano.png",
          ]);
          await onboardingPage.pedagogyEnd();
        }
      });

      await test.step("Set up new device", async () => {
        if (nano !== Nano.nanoSP) {
          await onboardingPage.startTutorial("v3-setup-new-device");

          await onboardingPage.setPinCode("v3-setup-new-device");

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-setup-new-device",
            "recovery-phrase-1.png",
          ]);
          await onboardingPage.acceptRecoveryPhrase();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-setup-new-device",
            "recovery-phrase-2.png",
          ]);
          await onboardingPage.continueTutorial();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-setup-new-device",
            "recovery-phrase-3.png",
          ]);
          await onboardingPage.continueTutorial();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-setup-new-device",
            "recovery-phrase-4.png",
          ]);
          await onboardingPage.continueTutorial();

          expect(await page.screenshot()).toMatchSnapshot([
            "v3-setup-new-device",
            "recovery-phrase-5.png",
          ]);
          await onboardingPage.continueTutorial();
        }
      });

      await test.step("Pass quiz", async () => {
        if (nano !== Nano.nanoSP) {
          expect(await page.screenshot()).toMatchSnapshot(["v3-quiz", "start.png"]);

          await onboardingPage.startQuiz();
          expect(await onboardingPage.quizContainer.screenshot()).toMatchSnapshot([
            "v3-quiz",
            "question-1.png",
          ]);

          await onboardingPage.answerQuizBottom();
          expect(await onboardingPage.quizContainer.screenshot()).toMatchSnapshot([
            "v3-quiz",
            "answer-1.png",
          ]);

          await onboardingPage.quizNextQuestion();
          expect(await onboardingPage.quizContainer.screenshot()).toMatchSnapshot([
            "v3-quiz",
            "question-2.png",
          ]);

          await onboardingPage.answerQuizBottom();
          expect(await onboardingPage.quizContainer.screenshot()).toMatchSnapshot([
            "v3-quiz",
            "answer-2.png",
          ]);

          await onboardingPage.quizNextQuestion();
          expect(await onboardingPage.quizContainer.screenshot()).toMatchSnapshot([
            "v3-quiz",
            "question-3.png",
          ]);

          await onboardingPage.answerQuizTop();
          expect(await onboardingPage.quizContainer.screenshot()).toMatchSnapshot([
            "v3-quiz",
            "answer-3.png",
          ]);

          await onboardingPage.quizEnd();
          expect(await page.screenshot()).toMatchSnapshot(["v3-quiz", "end.png"]);

          await onboardingPage.continueTutorial();
        }
      });

      await test.step(`[${nano}]"Device genuine check"`, async () => {
        if (nano !== Nano.nanoSP) {
          await onboardingPage.checkDevice();
        }
      });

      await test.step("Pass genuine check", async () => {
        if (nano !== Nano.nanoSP) {
          await onboardingPage.genuineCheck();
        }
      });

      await test.step("Reach app", async () => {
        if (nano !== Nano.nanoSP) {
          await onboardingPage.reachApp();
        }
      });
    });
  }
});
