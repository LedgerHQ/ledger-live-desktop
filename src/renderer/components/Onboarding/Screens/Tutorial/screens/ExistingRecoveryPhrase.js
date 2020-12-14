// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import CheckBox from "~/renderer/components/CheckBox";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import Box from "~/renderer/components/Box";
import InfoCircle from "~/renderer/icons/InfoCircle";
import {
  Illustration,
  ContentContainer,
  HeaderContainer,
} from "~/renderer/components/Onboarding/Screens/Tutorial/shared";
import recoveryPhrase from "~/renderer/components/Onboarding/Screens/Tutorial/assets/recoveryPhrase.svg";

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

export function ExistingRecoveryPhrase({ sendEvent, context }: Props) {
  const { t } = useTranslation();
  const { userUnderstandConsequences } = context;

  return (
    <ScreenContainer>
      <ContentContainer>
        <HeaderContainer>
          <Button color="palette.primary.contrastText" onClick={() => sendEvent("HELP")}>
            <Text mr="8px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
              {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.buttons.help")}
            </Text>
            <InfoCircle size={22} />
          </Button>
        </HeaderContainer>
        <Illustration height={261} width={320} src={recoveryPhrase} />
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="32px"
          lineHeight="38.73px"
        >
          {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.title")}
        </Text>
        <Text
          mt="16px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="18px"
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.paragraph1")}
        </Text>
        <Text
          mt="16px"
          mb="40px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="18px"
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.paragraph2")}
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
          <CheckBox isChecked={userUnderstandConsequences} inverted />
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
            {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.disclaimer")}
          </Text>
        </Box>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.primary.contrastText" onClick={() => sendEvent("PREV")}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.buttons.prev")}
          </Text>
        </Button>
        <Button
          inverted
          disabled={!userUnderstandConsequences}
          primary
          onClick={() => sendEvent("NEXT")}
        >
          <Text mr="12px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.buttons.next")}
          </Text>
          <ChevronRight size={12} />
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
