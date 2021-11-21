import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Bullet, Title, Column, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";

const steps = [
  {
    text: "onboarding.screens.tutorial.screens.deviceHowTo.turnOn.title",
    subText: "onboarding.screens.tutorial.screens.deviceHowTo.turnOn.descr",
  },
  {
    text: "onboarding.screens.tutorial.screens.deviceHowTo.browse.title",
    subText: "onboarding.screens.tutorial.screens.deviceHowTo.browse.descr",
  },
  {
    text: "onboarding.screens.tutorial.screens.deviceHowTo.select.title",
    subText: "onboarding.screens.tutorial.screens.deviceHowTo.select.descr",
  },
  {
    text: "onboarding.screens.tutorial.screens.deviceHowTo.follow.title",
    subText: "onboarding.screens.tutorial.screens.deviceHowTo.follow.descr",
  },
];

export function DeviceHowTo() {
  const { t } = useTranslation();

  return (
    <Column>
      <Title>{t("onboarding.screens.tutorial.screens.howToGetStarted.title")}</Title>
      {steps.map((step, index) => (
        <Bullet key={index} bulletText={index} text={t(step.text)} subText={t(step.subText)} />
      ))}
    </Column>
  );
}

DeviceHowTo.Illustration = <IllustrationContainer width="240px" height="245px" src={getStarted} />;

DeviceHowTo.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.deviceHowTo.buttons.next" />
);
