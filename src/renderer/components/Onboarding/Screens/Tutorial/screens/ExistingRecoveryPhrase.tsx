import React, { useContext } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Title, SubTitle, AsideFooter, CheckStep, Column, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";
import { TutorialContext } from "..";

export function ExistingRecoveryPhrase() {
  const { t } = useTranslation();
  const { userUnderstandConsequences, setUserUnderstandConsequences } = useContext(TutorialContext);

  return (
    <Column>
      <Title>{t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.title")}</Title>
      <SubTitle>
        {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.paragraph1")}
      </SubTitle>
      <SubTitle>
        {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.paragraph2")}
      </SubTitle>
      <CheckStep
        checked={userUnderstandConsequences}
        onClick={() => setUserUnderstandConsequences(!userUnderstandConsequences)}
        label={t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.disclaimer")}
      />
    </Column>
  );
}

ExistingRecoveryPhrase.Illustration = (
  <IllustrationContainer width="240px" height="245px" src={getStarted} />
);

const Footer = (props: any) => {
  const { t } = useTranslation();
  return (
    <AsideFooter
      {...props}
      text={t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.buttons.help")}
    />
  );
};

ExistingRecoveryPhrase.Footer = Footer;

ExistingRecoveryPhrase.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.existingRecoveryPhrase.buttons.next" />
);
