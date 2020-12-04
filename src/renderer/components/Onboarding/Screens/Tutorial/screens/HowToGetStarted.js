// @flow

import React from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import recoveryPhrase from "../assets/recoveryPhrase.svg";
import { Illustration, ContentContainer } from "../shared";

import { useTranslation } from "react-i18next";
import ArrowLeft from "~/renderer/icons/ArrowLeft";

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 40px 80px;
  box-sizing: border-box;
  position: relative;
`;

const ContentFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export function HowToGetStarted({ sendEvent }) {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <ContentContainer>
        <Illustration height={261} width={320} src={recoveryPhrase} />
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="32px"
          lineHeight="38.73px"
        >
          {t("onboarding.screens.tutorial.screens.importYourRecoveryPhrase.title")}
        </Text>
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="18px"
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.importYourRecoveryPhrase.paragraph1")}
        </Text>
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="18px"
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.importYourRecoveryPhrase.paragraph2")}
        </Text>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.primary.contrastText" onClick={() => sendEvent("PREV")}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.importYourRecoveryPhrase.buttons.prev")}
          </Text>
        </Button>
        <Button inverted primary onClick={() => sendEvent("NEXT")}>
          <Text ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.importYourRecoveryPhrase.buttons.next")}
          </Text>
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
