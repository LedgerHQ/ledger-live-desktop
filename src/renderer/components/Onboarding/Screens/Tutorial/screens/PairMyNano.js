// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import InfoCircle from "~/renderer/icons/InfoCircle";
import {
  ContentContainer,
  HeaderContainer,
  Illustration,
} from "~/renderer/components/Onboarding/Screens/Tutorial/shared";
import nanoPlug from "~/renderer/components/Onboarding/Screens/Tutorial/assets/nanoPlug.svg";

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

type Props = {
  sendEvent: (string, *) => void,
  context: {},
};

export function PairMyNano({ sendEvent, context }: Props) {
  const { t } = useTranslation();
  console.log(context);

  return (
    <ScreenContainer>
      <ContentContainer>
        <HeaderContainer>
          <Button color="palette.primary.contrastText" onClick={() => sendEvent("HELP")}>
            <Text mr="8px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
              {t("onboarding.screens.tutorial.screens.pairMyNano.buttons.help")}
            </Text>
            <InfoCircle size={22} />
          </Button>{" "}
        </HeaderContainer>
        <Illustration width={456} height={277} src={nanoPlug} />
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="32px"
          lineHeight="38.73px"
        >
          {t("onboarding.screens.tutorial.screens.pairMyNano.title")}
        </Text>
        <Text
          mt="16px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="18px"
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.pairMyNano.paragraph")}
        </Text>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.primary.contrastText" onClick={() => sendEvent("PREV")}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.pairMyNano.buttons.prev")}
          </Text>
        </Button>
        <Button inverted primary onClick={() => sendEvent("NEXT")}>
          <Text mr="12px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.pairMyNano.buttons.next")}
          </Text>
          <ChevronRight size={12} />
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
