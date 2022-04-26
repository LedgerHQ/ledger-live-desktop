import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Title, SubTitle, Column, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";
export function QuizFailure() {
  const { t } = useTranslation();

  return (
    <Column>
      <Title>{t("onboarding.screens.tutorial.screens.quizFailure.title")}</Title>
      <SubTitle>{t("onboarding.screens.tutorial.screens.quizFailure.paragraph")}</SubTitle>
    </Column>
  );
}

QuizFailure.Illustration = <IllustrationContainer width="240px" height="245px" src={getStarted} />;

QuizFailure.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.quizFailure.buttons.next" />
);
