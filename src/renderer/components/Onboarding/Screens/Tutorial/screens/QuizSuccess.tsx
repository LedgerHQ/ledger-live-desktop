import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Title, SubTitle, Column, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";

export function QuizSuccess() {
  const { t } = useTranslation();

  return (
    <Column>
      <Title>{t("onboarding.screens.tutorial.screens.quizSuccess.title")}</Title>
      <SubTitle>{t("onboarding.screens.tutorial.screens.quizSuccess.paragraph")}</SubTitle>
    </Column>
  );
}

QuizSuccess.Illustration = <IllustrationContainer width="240px" height="245px" src={getStarted} />;

QuizSuccess.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.quizSuccess.buttons.next" />
);
