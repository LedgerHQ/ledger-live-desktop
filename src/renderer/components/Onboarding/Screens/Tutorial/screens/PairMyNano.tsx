import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Title, Column, SubTitle, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";
export function PairMyNano() {
  const { t } = useTranslation();

  return (
    <Column>
      <Title>{t("onboarding.screens.tutorial.screens.pairMyNano.title")}</Title>
      <SubTitle>{t("onboarding.screens.tutorial.screens.pairMyNano.paragraph")}</SubTitle>
    </Column>
  );
}

PairMyNano.Illustration = <IllustrationContainer width="240px" height="245px" src={getStarted} />;

PairMyNano.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.pairMyNano.buttons.next" />
);
