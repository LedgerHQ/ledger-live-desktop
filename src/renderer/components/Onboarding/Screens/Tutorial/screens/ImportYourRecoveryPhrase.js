// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import recoveryPhrase from "../assets/recoveryPhrase.svg";
import { Illustration, ContentContainer } from "../shared";

import ArrowLeft from "~/renderer/icons/ArrowLeft";

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

type Props = {
  sendEvent: (string, *) => void,
  context: {
    deviceId: DeviceModelId,
  },
};

export function ImportYourRecoveryPhrase({ sendEvent }: Props) {
  const { t } = useTranslation();

  const onClickPrev = useCallback(() => sendEvent("PREV"), [sendEvent]);
  const onClickNext = useCallback(() => sendEvent("NEXT"), [sendEvent]);

  return (
    <ScreenContainer>
      <ContentContainer>
        <Illustration height={261} width={320} src={recoveryPhrase} />
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize={8}
          lineHeight="38.73px"
        >
          {t("onboarding.screens.tutorial.screens.importYourRecoveryPhrase.title")}
        </Text>
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize={6}
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.importYourRecoveryPhrase.paragraph1")}
        </Text>
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize={6}
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.importYourRecoveryPhrase.paragraph2")}
        </Text>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.primary.contrastText" onClick={onClickPrev}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.importYourRecoveryPhrase.buttons.prev")}
          </Text>
        </Button>
        <Button inverted primary onClick={onClickNext}>
          <Text ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.importYourRecoveryPhrase.buttons.next")}
          </Text>
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
