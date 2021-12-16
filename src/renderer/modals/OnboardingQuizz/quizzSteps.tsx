import { TFunction } from "react-i18next";
import { Icons } from "@ledgerhq/react-ui";

const Illustration = Icons.BracketsUltraLight;

export const getQuizzSteps = (t: TFunction<"translation", undefined>) => [
  {
    title: t("v3.onboarding.quizz.questions.1.text"),
    Illustration,
    choices: [
      {
        label: t("v3.onboarding.quizz.questions.1.answers.1"),
        correct: false,
      },
      {
        label: t("v3.onboarding.quizz.questions.1.answers.2"),
        correct: true,
      },
    ],
    correctAnswerTitle: t("v3.onboarding.quizz.questions.1.results.success.title"),
    incorrectAnswerTitle: t("v3.onboarding.quizz.questions.1.results.fail.title"),
    correctAnswerExplanation: t("v3.onboarding.quizz.questions.1.results.success.text"),
    incorrectAnswerExplanation: t("v3.onboarding.quizz.questions.1.results.fail.text"),
  },
  {
    title: t("v3.onboarding.quizz.questions.2.text"),
    Illustration,
    choices: [
      {
        label: t("v3.onboarding.quizz.questions.2.answers.1"),
        correct: false,
      },
      {
        label: t("v3.onboarding.quizz.questions.2.answers.2"),
        correct: true,
      },
    ],
    correctAnswerTitle: t("v3.onboarding.quizz.questions.2.results.success.title"),
    incorrectAnswerTitle: t("v3.onboarding.quizz.questions.2.results.fail.title"),
    correctAnswerExplanation: t("v3.onboarding.quizz.questions.2.results.success.text"),
    incorrectAnswerExplanation: t("v3.onboarding.quizz.questions.2.results.fail.text"),
  },
  {
    title: t("v3.onboarding.quizz.questions.3.text"),
    Illustration,
    choices: [
      {
        label: t("v3.onboarding.quizz.questions.3.answers.1"),
        correct: true,
      },
      {
        label: t("v3.onboarding.quizz.questions.3.answers.2"),
        correct: false,
      },
    ],
    correctAnswerTitle: t("v3.onboarding.quizz.questions.3.results.success.title"),
    incorrectAnswerTitle: t("v3.onboarding.quizz.questions.3.results.fail.title"),
    correctAnswerExplanation: t("v3.onboarding.quizz.questions.3.results.success.text"),
    incorrectAnswerExplanation: t("v3.onboarding.quizz.questions.3.results.fail.text"),
  },
];