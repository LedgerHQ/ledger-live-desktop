import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Bullet, Title, Column, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";

const steps = [
  {
    text: "onboarding.screens.tutorial.screens.deviceHowTo2.turnOn.title",
    subText: "onboarding.screens.tutorial.screens.deviceHowTo2.turnOn.descr",
  },
  {
    text: "onboarding.screens.tutorial.screens.deviceHowTo2.browse.title",
    subText: "onboarding.screens.tutorial.screens.deviceHowTo2.browse.descr",
  },
  {
    text: "onboarding.screens.tutorial.screens.deviceHowTo2.select.title",
    subText: "onboarding.screens.tutorial.screens.deviceHowTo2.select.descr",
  },
  {
    text: "onboarding.screens.tutorial.screens.deviceHowTo2.follow.title",
    subText: "onboarding.screens.tutorial.screens.deviceHowTo2.follow.descr",
  },
];

export function DeviceHowTo2() {
  const { t } = useTranslation();

  return (
    <Column>
      <Title>{t("onboarding.screens.tutorial.screens.deviceHowTo2.title")}</Title>
      {steps.map((step, index) => (
        <Bullet key={index} bulletText={index} text={t(step.text)} subText={t(step.subText)} />
      ))}
    </Column>
  );
}

DeviceHowTo2.Illustration = <IllustrationContainer width="240px" height="245px" src={getStarted} />;

DeviceHowTo2.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.deviceHowTo2.buttons.next" />
);
