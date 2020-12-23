// @flow

import React from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import CheckBox from "~/renderer/components/CheckBox";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useTranslation } from "react-i18next";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import Box from "~/renderer/components/Box";
import InfoCircle from "~/renderer/icons/InfoCircle";
import {
  Illustration,
  ContentContainer,
  HeaderContainer,
} from "~/renderer/components/Onboarding/Screens/Tutorial/shared";
import emptyRecoverySheet from "~/renderer/components/Onboarding/Screens/Tutorial/assets/emptyRecoverySheet.svg";

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
  context: {
    userUnderstandConsequences: boolean,
  },
};

export function NewRecoveryPhrase({ sendEvent, context }: Props) {
  const { t } = useTranslation();
  const { userUnderstandConsequences } = context;

  return (
    <ScreenContainer>
      <ContentContainer>
        <HeaderContainer>
          <Button color="palette.primary.contrastText" onClick={() => sendEvent("HELP")}>
            <Text mr="8px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
              {t("onboarding.screens.tutorial.screens.newRecoveryPhrase.buttons.help")}
            </Text>
            <InfoCircle size={22} />
          </Button>
        </HeaderContainer>
        <Illustration height={293} width={506} src={emptyRecoverySheet} />
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="32px"
          lineHeight="38.73px"
        >
          {t("onboarding.screens.tutorial.screens.newRecoveryPhrase.title")}
        </Text>
        <Text
          mt="16px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="18px"
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.newRecoveryPhrase.paragraph1")}
        </Text>
        <Text
          mt="16px"
          mb="40px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="18px"
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.newRecoveryPhrase.paragraph2")}
        </Text>
        <Box
          horizontal
          onClick={() =>
            sendEvent("RECOVERY_TERMS_CHANGED", { value: !userUnderstandConsequences })
          }
          style={{
            cursor: "pointer",
          }}
        >
          <CheckBox
            id="recoveryphrase-private-cb"
            isChecked={userUnderstandConsequences}
            inverted
          />
          <Text
            color="palette.primary.contrastText"
            ff="Inter|Regular"
            fontSize="13px"
            lineHeight="19.5px"
            ml="16px"
            style={{
              flex: 1,
            }}
          >
            {t("onboarding.screens.tutorial.screens.newRecoveryPhrase.disclaimer")}
          </Text>
        </Box>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.primary.contrastText" onClick={() => sendEvent("PREV")}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.newRecoveryPhrase.buttons.prev")}
          </Text>
        </Button>
        <Button
          inverted
          disabled={!userUnderstandConsequences}
          primary
          onClick={() => sendEvent("NEXT")}
          id="device-recoveryphrase-cta"
        >
          <Text mr="12px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.newRecoveryPhrase.buttons.next")}
          </Text>
          <ChevronRight size={12} />
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
