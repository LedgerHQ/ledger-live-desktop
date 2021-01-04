// @flow

import React, { useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import Button from "~/renderer/components/Button";
import { openURL } from "~/renderer/linking";
import { Computer } from "./assets/Computer";
import LangSwitcher from "~/renderer/components/Onboarding/LangSwitcher";
import { urls } from "~/config/urls";
import { WaveContainer } from "~/renderer/components/Onboarding/Screens/Tutorial/shared";
import { AnimatedWave } from "~/renderer/components/Onboarding/Screens/Tutorial/assets/AnimatedWave";
import useTheme from "~/renderer/hooks/useTheme";

const WelcomeContainer: ThemedComponent<*> = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

const TopContainer = styled.div`
  height: 40%;
  width: 100%;

  position: relative;
`;

const ComputerContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
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
  const theme = useTheme();

  const handleNext = useCallback(() => {
    sendEvent("NEXT");
  }, [sendEvent]);

  const buyNanoX = useCallback(() => {
    openURL(urls.noDevice.buyNew);
  }, []);

  return (
    <WelcomeContainer>
      <TopRightContainer>{null /* LL-4236 */ && <LangSwitcher />}</TopRightContainer>
      <WaveContainer>
        <AnimatedWave height={600} color={theme === "dark" ? "#587ED4" : "#4385F016"} />
      </WaveContainer>
      <TopContainer>
        <ComputerContainer>{theme === "light" ? <Computer /> : null}</ComputerContainer>
      </TopContainer>
      <Text mt={160} mb="4px" color="palette.text.shade100" ff="Inter|SemiBold" fontSize={32}>
        {t("onboarding.screens.welcome.title")}
      </Text>
      <Text mb="24px" color="palette.text.shade50" ff="Inter|Regular" fontSize={4}>
        {t("onboarding.screens.welcome.description")}
      </Text>
      <Button onClick={handleNext} primary id="onboarding-get-started-button">
        {t("onboarding.screens.welcome.cta")}
      </Button>
      <Text style={{ marginTop: 8 }} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={4}>
        <Trans i18nKey="onboarding.screens.welcome.noDevice">
          <Text
            style={{ cursor: "pointer", textDecorationSkip: "ink" }}
            ff="Inter|SemiBold"
            color="wallet"
            onClick={buyNanoX}
          />
        </Trans>
      </Text>
    </WelcomeContainer>
  );
}
