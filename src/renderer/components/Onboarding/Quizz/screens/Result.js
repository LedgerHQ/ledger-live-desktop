// @flow

import React from "react";
import styled from "styled-components";
import type { TFunction } from "react-i18next";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import failIllu from "../assets/answerFail.svg";
import successIllu from "../assets/answerSuccess.svg";

const Illu = styled.div`
  background: url(${({ success }) => (success ? successIllu : failIllu)});
  margin-top: 84px;
  width: 150px;
  height: ${({ success }) => (success ? 137 : 132)}px;
`;

type Props = {
  sendEvent: string => void,
  t: TFunction,
  state: {
    value: string,
    context: *,
  },
  meta: {
    text: string,
    answers: { text: string }[],
  },
};

export function Result({ sendEvent, t, meta, state }: Props) {
  const { context } = state;

  const result = context.results[state.value];
  const isLast = context.currentQuestionIndex + 1 === context.totalQuestions;

  const wordings = meta[result];

  return (
    <React.Fragment>
      <Illu success={result === "success"} />
      <Text
        mt="42px"
        mb="8px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="22px"
        lineHeight="26.63px"
      >
        {t(wordings.title)}
      </Text>
      <Text
        mt="8px"
        mb="32px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="13px"
        lineHeight="15.73px"
      >
        {t(wordings.text)}
      </Text>
      <Button data-test-id="quiz-next-cta" primary onClick={() => sendEvent("NEXT")}>
        {t(isLast ? "onboarding.quizz.buttons.finish" : "onboarding.quizz.buttons.next")}
      </Button>
    </React.Fragment>
  );
}
