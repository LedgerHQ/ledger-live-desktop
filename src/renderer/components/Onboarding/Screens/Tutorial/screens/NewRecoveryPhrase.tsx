import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Title, SubTitle, AsideFooter, CheckStep, Column, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";

type Props = {
  sendEvent: (event: string, params: any) => void;
  context: {
    userUnderstandConsequences: boolean;
  };
};

export function NewRecoveryPhrase({ sendEvent, context }: Props) {
  const { t } = useTranslation();
  const { userUnderstandConsequences } = context;

  return (
    <Column>
      <Title>{t("onboarding.screens.tutorial.screens.newRecoveryPhrase.title")}</Title>
      <SubTitle>{t("onboarding.screens.tutorial.screens.newRecoveryPhrase.paragraph1")}</SubTitle>
      <SubTitle>{t("onboarding.screens.tutorial.screens.newRecoveryPhrase.paragraph2")}</SubTitle>
      <CheckStep
        checked={userUnderstandConsequences}
        onClick={() => sendEvent("RECOVERY_TERMS_CHANGED", { value: !userUnderstandConsequences })}
        label={t("onboarding.screens.tutorial.screens.newRecoveryPhrase.disclaimer")}
      />
    </Column>
  );
}

NewRecoveryPhrase.Illustration = (
  <IllustrationContainer width="240px" height="245px" src={getStarted} />
);

const Footer = (props: any) => {
  const { t } = useTranslation();
  return (
    <AsideFooter
      {...props}
      text={t("onboarding.screens.tutorial.screens.newRecoveryPhrase.buttons.help")}
    />
  );
};

NewRecoveryPhrase.Footer = Footer;

NewRecoveryPhrase.canContinue = context => context.userUnderstandConsequences;

NewRecoveryPhrase.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.newRecoveryPhrase.buttons.next" />
);
