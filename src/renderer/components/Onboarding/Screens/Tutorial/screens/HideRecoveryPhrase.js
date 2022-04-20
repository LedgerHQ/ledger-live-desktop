// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import EyeOff from "~/renderer/icons/EyeOff";
import CameraOff from "~/renderer/icons/CameraOff";
import InfoCircle from "~/renderer/icons/InfoCircle";
import { HeaderContainer, Illustration, ContentContainer } from "../shared";
import hideSeed from "~/renderer/components/Onboarding/Screens/Tutorial/assets/hideSeed.svg";

const ScreenContainer: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 40px 80px;
  box-sizing: border-box;
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
  context: {},
};

export function HideRecoveryPhrase({ sendEvent, context }: Props) {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <ContentContainer>
        <HeaderContainer>
          <Button color="palette.primary.contrastText" onClick={() => sendEvent("HELP")}>
            <Text mr="8px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
              {t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.buttons.help")}
            </Text>
            <InfoCircle size={22} />
          </Button>
        </HeaderContainer>
        <Illustration height={251} width={374} src={hideSeed} />
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="32px"
          lineHeight="38.73px"
        >
          {t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.title")}
        </Text>
        <Text
          mt="16px"
          mb="24px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="18px"
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.paragraph")}
        </Text>
        <Row>
          <IconContainer>
            <CameraOff size={12} color="#EA2E49" />
          </IconContainer>
          <Text
            ml="20px"
            color="palette.primary.contrastText"
            ff="Inter|Regular"
            fontSize="13px"
            lineHeight="19.5px"
          >
            {t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.keepItOffline")}
          </Text>
        </Row>
        <Row>
          <IconContainer>
            <EyeOff size={12} color="#EA2E49" />
          </IconContainer>
          <Text
            ml="20px"
            color="palette.primary.contrastText"
            ff="Inter|Regular"
            fontSize="13px"
            lineHeight="19.5px"
          >
            {t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.neverShowToAnyone")}
          </Text>
        </Row>
        <Row>
          <Button color="palette.primary.contrastText" onClick={() => sendEvent("HELP")}>
            <Text mr="8px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
              {t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.buttons.learn")}
            </Text>
            <InfoCircle size={22} />
          </Button>
        </Row>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.primary.contrastText" onClick={() => sendEvent("PREV")}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.buttons.prev")}
          </Text>
        </Button>
        <Button data-test-id="hide-recovery-cta" inverted primary onClick={() => sendEvent("NEXT")}>
          <Text ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.buttons.next")}
          </Text>
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
