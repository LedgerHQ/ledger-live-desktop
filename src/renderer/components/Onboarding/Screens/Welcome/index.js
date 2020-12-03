// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import Button from "~/renderer/components/Button";

import { Computer } from "./assets/Computer";
import { Wave } from "./assets/Wave";

const WelcomeContainer = styled.div`
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

export function Welcome({ sendEvent }) {
  const { t } = useTranslation();

  const handleNext = useCallback(() => {
    sendEvent("NEXT");
  }, []);

  return (
    <WelcomeContainer>
      <TopContainer>
        <WaveContainer>
          <Wave />
        </WaveContainer>
        <ComputerContainer>
          <Computer />
        </ComputerContainer>
      </TopContainer>
      <Text mt="160px" mb="4px" color="palette.text.shade100" ff="Inter|SemiBold" fontSize="32px">
        {t("onboarding.screens.welcome.title")}
      </Text>
      <Text mb="24px" color="palette.text.shade50" ff="Inter|Regular" fontSize="13px">
        {t("onboarding.screens.welcome.description")}
      </Text>
      <Button onClick={handleNext} primary>
        {t("onboarding.screens.welcome.cta")}
      </Button>
      <Text mt="8px" color="palette.text.shade100" ff="Inter|SemiBold" fontSize="13px">
        {t("onboarding.screens.welcome.noDevice")}
      </Text>
    </WelcomeContainer>
  );
}
