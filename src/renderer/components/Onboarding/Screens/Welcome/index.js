// @flow

import React, { useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import Button from "~/renderer/components/Button";
import Image from "~/renderer/components/Image";
import { openURL } from "~/renderer/linking";
import LangSwitcher from "~/renderer/components/Onboarding/LangSwitcher";
import { urls } from "~/config/urls";
import { WaveContainer } from "~/renderer/components/Onboarding/Screens/Tutorial/shared";
import { AnimatedWave } from "~/renderer/components/Onboarding/Screens/Tutorial/assets/AnimatedWave";
import illustration from "~/renderer/components/Onboarding/Screens/Welcome/assets/welcome.svg";
import illustrationDark from "~/renderer/components/Onboarding/Screens/Welcome/assets/welcome-dark.svg";
import useTheme from "~/renderer/hooks/useTheme";
import FakeLink from "~/renderer/components/FakeLink";

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

const IllustrationContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
`;

const TopRightContainer = styled.div`
  position: absolute;
  right: 40px;
  top: 40px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type Props = {
  sendEvent: string => void,
  onboardingRelaunched: boolean,
};

export function Welcome({ sendEvent, onboardingRelaunched }: Props) {
  const { t } = useTranslation();
  const themeType = useTheme("colors.palette.type");
  const welcomeIllustration = themeType === "dark" ? illustrationDark : illustration;

  const handleNext = useCallback(() => {
    sendEvent("NEXT");
  }, [sendEvent]);

  const buyNanoX = useCallback(() => {
    openURL(urls.noDevice.buyNew);
  }, []);

  return (
    <WelcomeContainer>
      <TopRightContainer>
        <LangSwitcher />
      </TopRightContainer>
      <WaveContainer>
        <AnimatedWave height={600} color="#4385F016" />
      </WaveContainer>
      <TopContainer>
        <IllustrationContainer>
          <Image resource={welcomeIllustration} alt="" draggable="false" height={370} />
        </IllustrationContainer>
      </TopContainer>
      <Text mt={120} mb="4px" color="palette.text.shade100" ff="Inter|SemiBold" fontSize={32}>
        {t("onboarding.screens.welcome.title")}
      </Text>
      <Text mb="24px" color="palette.text.shade50" ff="Inter|Regular" fontSize={4}>
        {t("onboarding.screens.welcome.description")}
      </Text>
      <ButtonContainer>
        <Button onClick={handleNext} primary data-test-id="onboarding-get-started-button">
          {t("onboarding.screens.welcome.cta")}
        </Button>
        {onboardingRelaunched && (
          <Button onClick={() => sendEvent("PREV")}>{t("common.previous")}</Button>
        )}
      </ButtonContainer>
      <Text style={{ marginTop: 8 }} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={4}>
        <Trans i18nKey="onboarding.screens.welcome.noDevice">
          <FakeLink onClick={buyNanoX}>
            <Text
              style={{ cursor: "pointer", textDecorationSkip: "ink" }}
              ff="Inter|SemiBold"
              color="wallet"
              onClick={buyNanoX}
            />
          </FakeLink>
        </Trans>
      </Text>
    </WelcomeContainer>
  );
}
