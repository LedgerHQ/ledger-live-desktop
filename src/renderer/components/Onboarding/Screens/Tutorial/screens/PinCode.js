// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import CheckBox from "~/renderer/components/CheckBox";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import Box from "~/renderer/components/Box";
import InfoCircle from "~/renderer/icons/InfoCircle";
import pinCode from "../assets/pinCode.svg";
import { HeaderContainer, ContentContainer, Illustration } from "../shared";

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
    userChosePincodeHimself: boolean,
  },
};

export function PinCode({ sendEvent, context }: Props) {
  const { t } = useTranslation();
  const { userChosePincodeHimself } = context;

  const onClickHelp = useCallback(() => sendEvent("HELP"), [sendEvent]);
  const onClickNext = useCallback(() => sendEvent("NEXT"), [sendEvent]);
  const onClickPrev = useCallback(() => sendEvent("PREV"), [sendEvent]);
  const onClickTermsChange = useCallback(
    () => sendEvent("PINCODE_TERMS_CHANGED", { value: !userChosePincodeHimself }),
    [sendEvent, userChosePincodeHimself],
  );

  return (
    <ScreenContainer>
      <ContentContainer>
        <HeaderContainer>
          <Button color="palette.primary.contrastText" onClick={onClickHelp}>
            <Text mr="8px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
              {t("onboarding.screens.tutorial.screens.pinCode.buttons.help")}
            </Text>
            <InfoCircle size={22} />
          </Button>
        </HeaderContainer>
        <Illustration width={456} height={277} src={pinCode} />
        <Text
          style={{ marginTop: 32 }}
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize={8}
          lineHeight="38.73px"
        >
          {t("onboarding.screens.tutorial.screens.pinCode.title")}
        </Text>
        <Text
          mt="32px"
          mb="40px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize={6}
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.pinCode.paragraph")}
        </Text>
        <Box
          horizontal
          onClick={onClickTermsChange}
          style={{
            cursor: "pointer",
          }}
        >
          <CheckBox id="pincode-private-cb" isChecked={userChosePincodeHimself} inverted />
          <Text
            color="palette.primary.contrastText"
            ff="Inter|Regular"
            fontSize={4}
            lineHeight="19.5px"
            ml="16px"
          >
            {t("onboarding.screens.tutorial.screens.pinCode.disclaimer")}
          </Text>
        </Box>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.primary.contrastText" onClick={onClickPrev}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.pinCode.buttons.prev")}
          </Text>
        </Button>
        <Button
          id="device-pincode-cta"
          inverted
          disabled={!userChosePincodeHimself}
          primary
          onClick={onClickNext}
        >
          <Text mr="12px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.pinCode.buttons.next")}
          </Text>
          <ChevronRight size={12} />
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
