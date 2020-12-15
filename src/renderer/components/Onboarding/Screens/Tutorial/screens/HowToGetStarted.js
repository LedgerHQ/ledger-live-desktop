// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import hourglass from "../assets/hourglass.svg";
import { Illustration, ContentContainer } from "../shared";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import Clock from "~/renderer/icons/Clock";
import Pen from "~/renderer/icons/Pen";
import Flower from "~/renderer/icons/Flower";

const ScreenContainer: ThemedComponent<*> = styled.div`
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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  align-items: center;
`;

const IconContainer = styled.div`
  background-color: #ffffff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  sendEvent: (string, *) => void,
};

export function HowToGetStarted({ sendEvent }: Props) {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <ContentContainer>
        <Illustration width={326} height={243} src={hourglass} />
        <Text
          mt="32px"
          mb="24px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="32px"
          lineHeight="38.73px"
        >
          {t("onboarding.screens.tutorial.screens.howToGetStarted.title")}
        </Text>
        <Row>
          <IconContainer>
            <Clock size={12} color="#6490F1" />
          </IconContainer>
          <Text
            ml="20px"
            color="palette.primary.contrastText"
            ff="Inter|Regular"
            fontSize="13px"
            lineHeight="19.5px"
          >
            {t("onboarding.screens.tutorial.screens.howToGetStarted.rules.1")}
          </Text>
        </Row>
        <Row>
          <IconContainer>
            <Pen size={12} color="#6490F1" />
          </IconContainer>
          <Text
            ml="20px"
            color="palette.primary.contrastText"
            ff="Inter|Regular"
            fontSize="13px"
            lineHeight="19.5px"
          >
            {t("onboarding.screens.tutorial.screens.howToGetStarted.rules.2")}
          </Text>
        </Row>
        <Row>
          <IconContainer>
            <Flower size={12} color="#6490F1" />
          </IconContainer>
          <Text
            ml="20px"
            color="palette.primary.contrastText"
            ff="Inter|Regular"
            fontSize="13px"
            lineHeight="19.5px"
          >
            {t("onboarding.screens.tutorial.screens.howToGetStarted.rules.3")}
          </Text>
        </Row>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.primary.contrastText" onClick={() => sendEvent("PREV")}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.howToGetStarted.buttons.prev")}
          </Text>
        </Button>
        <Button id="get-started-cta" inverted primary onClick={() => sendEvent("NEXT")}>
          <Text ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.howToGetStarted.buttons.next")}
          </Text>
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
