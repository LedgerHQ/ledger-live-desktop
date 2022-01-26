// @flow

import React, { useCallback } from "react";
import Text from "~/renderer/components/Text";
import type { TFunction } from "react-i18next";
import Button from "~/renderer/components/Button";
import styled from "styled-components";
import { Illustration } from "~/renderer/components/Onboarding/Screens/Tutorial/shared";
import deviceOnToken from "./assets/deviceOnToken.svg";
import smartphoneAndCurrencies from "./assets/smartphoneAndCurrencies.svg";
import accessYourCoins from "./assets/accessYourCoins.svg";
import fingerprintNano from "./assets/fingerprintNano.svg";
import keyInABall from "./assets/keyInABall.svg";

type ScreenProps = {
  t: TFunction,
  sendEvent: string => void,
};

const IllustrationContainer = styled.div`
  height: 240px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  z-index: -1;
`;

export function AccessYourCoins({ t }: ScreenProps) {
  return (
    <React.Fragment>
      <IllustrationContainer>
        <Illustration height={218} width={443} src={accessYourCoins} />
      </IllustrationContainer>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="28px"
        lineHeight="33.89px"
      >
        {t("onboarding.pedagogy.screens.accessYourCoins.title")}
      </Text>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="14px"
        lineHeight="19.5px"
      >
        {t("onboarding.pedagogy.screens.accessYourCoins.description")}
      </Text>
    </React.Fragment>
  );
}

export function OwnYourPrivateKey({ t }: ScreenProps) {
  return (
    <React.Fragment>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="28px"
        lineHeight="33.89px"
      >
        {t("onboarding.pedagogy.screens.ownYourPrivateKey.title")}
      </Text>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="14px"
        lineHeight="19.5px"
      >
        {t("onboarding.pedagogy.screens.ownYourPrivateKey.description")}
      </Text>
      <IllustrationContainer>
        <Illustration height={165} width={205} src={keyInABall} />
      </IllustrationContainer>
    </React.Fragment>
  );
}

export function StayOffline({ t }: ScreenProps) {
  return (
    <React.Fragment>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="28px"
        lineHeight="33.89px"
      >
        {t("onboarding.pedagogy.screens.stayOffline.title")}
      </Text>
      <Text
        mt="8px"
        mb="33px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="14px"
        lineHeight="19.5px"
      >
        {t("onboarding.pedagogy.screens.stayOffline.description")}
      </Text>
      <IllustrationContainer>
        <Illustration height={160} width={443} src={deviceOnToken} />
      </IllustrationContainer>
    </React.Fragment>
  );
}

export function ValidateTransactions({ t }: ScreenProps) {
  return (
    <React.Fragment>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="28px"
        lineHeight="33.89px"
      >
        {t("onboarding.pedagogy.screens.validateTransactions.title")}
      </Text>
      <Text
        mt="8px"
        mb="28px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="14px"
        lineHeight="19.5px"
      >
        {t("onboarding.pedagogy.screens.validateTransactions.description")}
      </Text>
      <IllustrationContainer>
        <Illustration height={177} width={430} src={smartphoneAndCurrencies} />
      </IllustrationContainer>
    </React.Fragment>
  );
}

export function SetUpNanoWallet({ t, sendEvent }: ScreenProps) {
  const onClick = useCallback(() => sendEvent("DONE"), [sendEvent]);
  return (
    <React.Fragment>
      <Text
        mt="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="28px"
        lineHeight="33.89px"
      >
        {t("onboarding.pedagogy.screens.setUpNanoWallet.title")}
      </Text>
      <Text
        mt="8px"
        mb="24px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="14px"
        lineHeight="19.5px"
      >
        {t("onboarding.pedagogy.screens.setUpNanoWallet.description")}
      </Text>
      <Button primary onClick={onClick} data-test-id="setup-nano-wallet-cta">
        <Text ff="Inter|SemiBold" fontSize="12px">
          {t("onboarding.pedagogy.screens.setUpNanoWallet.CTA")}
        </Text>
      </Button>
      <IllustrationContainer>
        <Illustration height={145} width={188} src={fingerprintNano} />
      </IllustrationContainer>
    </React.Fragment>
  );
}
