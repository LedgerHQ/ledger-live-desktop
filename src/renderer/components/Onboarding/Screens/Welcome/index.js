// @flow

import React, { useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useSelector } from "react-redux";
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
import { userThemeSelector } from "~/renderer/reducers/settings";
import illustration from "~/renderer/components/Onboarding/Screens/Welcome/assets/welcome.svg";
import illustrationDark from "~/renderer/components/Onboarding/Screens/Welcome/assets/welcome-dark.svg";
import { onboardingRelaunchedSelector } from "~/renderer/reducers/onboarding";
import useTheme from "~/renderer/hooks/useTheme";

const WelcomeContainer: ThemedComponent<*> = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  background: ${p => p.theme.colors.palette.background.wave};
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
`;

type Props = {
  sendEvent: string => void,
};

export const Welcome = ({ sendEvent }: Props) => {
  const { t } = useTranslation();
  const theme = useSelector(userThemeSelector);
  const useDarkColorPalette = ["dark", "dusk"].includes(theme);
  const onboardingRelaunched = useSelector(onboardingRelaunchedSelector);
  const welcomeIllustration = useDarkColorPalette ? illustrationDark : illustration;
  const waveColor = useTheme("colors.palette.wave");

  const handleNext = useCallback(() => {
    sendEvent("NEXT");
  }, [sendEvent]);
  const handleQuit = useCallback(() => sendEvent("QUIT"), [sendEvent]);

  const buyNanoX = useCallback(() => {
    openURL(urls.noDevice.buyNew);
  }, []);

  return (
    <WelcomeContainer dark={useDarkColorPalette}>
      <TopRightContainer>
        {null /* LL-4236 */ && <LangSwitcher />}
        {onboardingRelaunched ? (
          <Button small onClick={handleQuit}>
            {t("common.cancel")}
          </Button>
        ) : null}
      </TopRightContainer>
      <WaveContainer>
        <AnimatedWave height={600} color={waveColor} />
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
};
