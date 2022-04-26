import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Title, AsideFooter, Column, Bullet, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";

import NanoDeviceCheckIcon from "~/renderer/icons/NanoDeviceCheckIcon";
import NanoDeviceCancelIcon from "~/renderer/icons/NanoDeviceCancelIcon";
import { useTheme } from "styled-components";

export function PinCodeHowTo() {
  const { colors } = useTheme();
  const color = colors.palette.primary.c80;
  const steps = [
    {
      text: <Trans i18nKey="onboarding.screens.tutorial.screens.pinCodeHowTo.setUp.title" />,
      subText: (
        <Trans i18nKey="onboarding.screens.tutorial.screens.pinCodeHowTo.setUp.descr">
          <NanoDeviceCheckIcon color={color} style={{ margin: "0 4px" }} />
          <NanoDeviceCancelIcon color={color} style={{ margin: "0 4px" }} />
        </Trans>
      ),
    },
    {
      text: <Trans i18nKey="onboarding.screens.tutorial.screens.pinCodeHowTo.confirm.title" />,
      subText: <Trans i18nKey="onboarding.screens.tutorial.screens.pinCodeHowTo.confirm.descr" />,
    },
  ];

  return (
    <Column>
      <Title>
        <Trans i18nKey="onboarding.screens.tutorial.screens.pinCode.title" />
      </Title>
      {steps.map((step, index) => (
        <Bullet key={index} bulletText={index} text={step.text} subText={step.subText} />
      ))}
    </Column>
  );
}

PinCodeHowTo.Illustration = <IllustrationContainer width="240px" height="245px" src={getStarted} />;

const Footer = (props: any) => {
  const { t } = useTranslation();
  return (
    <AsideFooter
      {...props}
      text={t("onboarding.screens.tutorial.screens.pinCodeHowTo.buttons.help")}
    />
  );
};

PinCodeHowTo.Footer = Footer;

PinCodeHowTo.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.pinCodeHowTo.buttons.next" />
);
