import React, { useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Title, SubTitle, AsideFooter, CheckStep, Column, IllustrationContainer } from "../shared";
import getStarted from "../assets/v3/getStarted.png";

type Props = {
  sendEvent: (event: string, props: any) => void;
  context: {
    userChosePincodeHimself: boolean;
  };
};

export function PinCode({ sendEvent, context }: Props) {
  const { t } = useTranslation();
  const { userChosePincodeHimself } = context;

  const onClickTermsChange = useCallback(
    () => sendEvent("PINCODE_TERMS_CHANGED", { value: !userChosePincodeHimself }),
    [sendEvent, userChosePincodeHimself],
  );

  return (
    <Column>
      <Title>{t("onboarding.screens.tutorial.screens.pinCode.title")}</Title>
      <SubTitle>{t("onboarding.screens.tutorial.screens.pinCode.paragraph")}</SubTitle>
      <CheckStep
        checked={userChosePincodeHimself}
        onClick={onClickTermsChange}
        label={t("onboarding.screens.tutorial.screens.pinCode.disclaimer")}
      />
    </Column>
  );
}

PinCode.Illustration = <IllustrationContainer width="240px" height="245px" src={getStarted} />;

const Footer = (props: any) => {
  const { t } = useTranslation();
  return (
    <AsideFooter {...props} text={t("onboarding.screens.tutorial.screens.pinCode.buttons.help")} />
  );
};

PinCode.Footer = Footer;

PinCode.canContinue = context => context.userChosePincodeHimself;

PinCode.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.pinCode.buttons.next" />
);
