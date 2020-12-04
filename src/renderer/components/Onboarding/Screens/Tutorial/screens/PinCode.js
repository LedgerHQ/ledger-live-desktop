// @flow

import React from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import CheckBox from "~/renderer/components/CheckBox";

import pinCode from "../assets/pinCode.svg";
import { useTranslation } from "react-i18next";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import Box from "~/renderer/components/Box";
import InfoCircle from "~/renderer/icons/InfoCircle";
import { HeaderContainer, ContentContainer, Illustration } from "../shared";

const ScreenContainer = styled.div`
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

export function PinCode({ sendEvent, context }) {
  const { t } = useTranslation();
  console.log(context);

  return (
    <ScreenContainer>
      <ContentContainer>
        <HeaderContainer>
          <Button color="palette.primary.contrastText" onClick={() => sendEvent("HELP")}>
            <Text mr="8px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
              {t("onboarding.screens.tutorial.screens.pinCode.buttons.help")}
            </Text>
            <InfoCircle size={22} />
          </Button>
        </HeaderContainer>
        <Illustration width={456} height={277} src={pinCode} />
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="32px"
          lineHeight="38.73px"
        >
          {t("onboarding.screens.tutorial.screens.pinCode.title")}
        </Text>
        <Text
          mt="32px"
          mb="40px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="18px"
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.pinCode.paragraph")}
        </Text>
        <Box
          horizontal
          onClick={() =>
            sendEvent("PINCODE_TERMS_CHANGED", { value: !context.userChosePincodeHimself })
          }
          style={{
            cursor: "pointer",
          }}
        >
          <CheckBox isChecked={context.userChosePincodeHimself} inverted />
          <Text
            color="palette.primary.contrastText"
            ff="Inter|Regular"
            fontSize="13px"
            lineHeight="19.5px"
            ml="16px"
          >
            {t("onboarding.screens.tutorial.screens.pinCode.disclaimer")}
          </Text>
        </Box>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.primary.contrastText" onClick={() => sendEvent("PREV")}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.pinCode.buttons.prev")}
          </Text>
        </Button>
        <Button
          inverted
          disabled={!context.userChosePincodeHimself}
          primary
          onClick={() => sendEvent("NEXT")}
        >
          <Text mr="12px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.pinCode.buttons.next")}
          </Text>
          <ChevronRight size={12} />
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
