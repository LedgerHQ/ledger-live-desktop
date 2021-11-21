import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Title, SubTitle, Column, IllustrationContainer } from "../../Screens/Tutorial/shared";
import { Button } from "@ledgerhq/react-ui";
import getStarted from "../assets/v3/getStarted.png";

type Props = {
  sendEvent: (event: string) => void;
};

export function Intro({ sendEvent }: Props) {
  const { t } = useTranslation();

  return (
    <Column>
      <Title>{t("onboarding.quizz.title")}</Title>
      <SubTitle>{t("onboarding.quizz.descr")}</SubTitle>
      <Button variant="main" onClick={() => sendEvent("START")}>
        {t("onboarding.quizz.buttons.start")}
      </Button>
    </Column>
  );
}

Intro.Illustration = <IllustrationContainer width="240px" height="245px" src={getStarted} />;

Intro.continueLabel = <Trans i18nKey="onboarding.quizz.buttons.start" />;
Intro.onContinue = (sendEvent: (event: string) => void) => sendEvent("START");
