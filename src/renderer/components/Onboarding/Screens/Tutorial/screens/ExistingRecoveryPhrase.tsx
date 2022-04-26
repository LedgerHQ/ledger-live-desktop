import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Title, SubTitle, AsideFooter, CheckStep, Column, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";

type Props = {
  userUnderstandConsequences: boolean;
  toggleUserUnderstandConsequences: () => void;
};
export function ExistingRecoveryPhrase({
  userUnderstandConsequences,
  toggleUserUnderstandConsequences,
}: Props) {
  const { t } = useTranslation();

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
        onClick={toggleUserUnderstandConsequences}
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
