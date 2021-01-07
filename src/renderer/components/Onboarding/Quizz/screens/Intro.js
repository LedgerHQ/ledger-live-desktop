// @flow

import React from "react";
import styled from "styled-components";
import type { TFunction } from "react-i18next";
import Text from "~/renderer/components/Text";
import { Illustration } from "~/renderer/components/Onboarding/Screens/Tutorial/shared";
import gameOn from "../assets/gameOn.svg";
import Button from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const IntroContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

type Props = {
  sendEvent: ({ type: string, answerIndex: number } | string) => void,
  t: TFunction,
  meta: {
    text: string,
    answers: { text: string }[],
  },
};

export function Intro({ sendEvent, t, meta }: Props) {
  return (
    <IntroContainer>
      <Illustration src={gameOn} height={206} width={130} />
      <Text
        mt="32px"
        mb="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="22px"
        lineHeight="26.63px"
      >
        {t("onboarding.quizz.title")}
      </Text>
      <Text
        mt="8px"
        mb="32px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="13px"
        lineHeight="15.63px"
      >
        {t("onboarding.quizz.descr")}
      </Text>
      <Button id="quizz-start-cta" primary onClick={() => sendEvent("START")}>
        <Text>{t("onboarding.quizz.buttons.start")}</Text>
      </Button>
    </IntroContainer>
  );
}
