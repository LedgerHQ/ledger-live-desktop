// @flow

import React from "react";
import styled from "styled-components";
import type { TFunction } from "react-i18next";
import WtfIsThis from "~/renderer/components/Onboarding/Quizz/assets/WtfIsThis.svg";
import { Wave } from "../assets/Wave";
import Text from "~/renderer/components/Text";

const WaveContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -40px;
  display: flex;
`;

const SecurityContainer = styled.div`
  width: 293px;
  height: 240px;
  background: url(${WtfIsThis}) center no-repeat;
  position: absolute;
  left: 50%;
  bottom: 25%;
  transform: translate(-50%, 50%);
  pointer-events: none;
`;

const AnswerButton = styled.div`
  width: 272px;
  border-radius: 4px;
  padding: 10px 16px;
  background: #ffffff;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: filter ease-out 100ms;
  text-align: center;
  z-index: 1;

  &:hover {
    filter: brightness(95%);
  }

  &:active {
    filter: brightness(90%);
  }
`;

type Props = {
  sendEvent: ({ type: string, answerIndex: number }) => void,
  t: TFunction,
  meta: {
    text: string,
    answers: { text: string }[],
  },
};

export function Question({ sendEvent, t, meta }: Props) {
  return (
    <>
      <Text
        mt="72px"
        mb="8px"
        color="palette.primary.main"
        ff="Inter|Bold"
        fontSize="10px"
        lineHeight="12.1px"
        uppercase
        letterSpacing="0.1em"
      >
        {t("onboarding.quizz.heading")}
      </Text>
      <Text
        mb="24px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="22px"
        lineHeight="26.63px"
      >
        {t(meta.text)}
      </Text>
      {meta.answers.map((answer, index) => (
        <AnswerButton
          data-test-id={`quiz-answer-${index}`}
          key={index}
          onClick={() => sendEvent({ type: "ANSWERED", answerIndex: index })}
        >
          <Text color="palette.primary.main" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t(answer.text)}
          </Text>
        </AnswerButton>
      ))}
      <WaveContainer>
        <Wave />
      </WaveContainer>
      <SecurityContainer />
    </>
  );
}
