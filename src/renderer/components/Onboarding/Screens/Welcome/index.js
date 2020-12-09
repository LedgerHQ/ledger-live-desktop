// @flow

import React, { useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import Button from "~/renderer/components/Button";
import { openURL } from "~/renderer/linking";
import { Computer } from "./assets/Computer";
import { Wave } from "./assets/Wave";
import LangSwitcher from "~/renderer/components/Onboarding/LangSwitcher";
import { urls } from "~/config/urls";

const WelcomeContainer: ThemedComponent<*> = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const TopContainer = styled.div`
  height: 40%;
  width: 100%;
  background-color: #eff4fe;
  position: relative;
`;

const ComputerContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
`;

const WaveContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(50%);
`;

const TopRightContainer = styled.div`
  position: absolute;
  right: 40px;
  top: 40px;
  z-index: 1;
`;

type Props = {
  sendEvent: string => void,
};

export function Welcome({ sendEvent }: Props) {
  const { t } = useTranslation();

  const handleNext = useCallback(() => {
    sendEvent("NEXT");
  }, [sendEvent]);

  const buyNanoX = useCallback(() => {
    openURL(urls.noDevice.buyNew);
  }, []);

  return (
    <WelcomeContainer>
      <TopRightContainer>
        <LangSwitcher onNext={handleNext} />
      </TopRightContainer>
      <TopContainer>
        <WaveContainer>
          <Wave />
        </WaveContainer>
        <ComputerContainer>
          <Computer />
        </ComputerContainer>
      </TopContainer>
      <Text mt={160} mb="4px" color="palette.text.shade100" ff="Inter|SemiBold" fontSize={32}>
        {t("onboarding.screens.welcome.title")}
      </Text>
      <Text mb="24px" color="palette.text.shade50" ff="Inter|Regular" fontSize={4}>
        {t("onboarding.screens.welcome.description")}
      </Text>
      <Button onClick={handleNext} primary>
        {t("onboarding.screens.welcome.cta")}
      </Button>
      <Text style={{ marginTop: 8 }} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={4}>
        <Trans i18nKey="onboarding.screens.welcome.noDevice">
          <Text
            style={{ cursor: "pointer", textDecorationSkip: "ink" }}
            ff="Inter|SemiBold"
            color="wallet"
            onClick={buyNanoX}
          ></Text>
        </Trans>
      </Text>
    </WelcomeContainer>
  );
}
