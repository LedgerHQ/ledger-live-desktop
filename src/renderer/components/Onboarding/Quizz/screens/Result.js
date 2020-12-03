// @flow

import React from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import failIllu from "../assets/answerFail.svg";
import successIllu from "../assets/answerSuccess.svg";

const Illu = styled.div`
  background: url(${({ success }) => (success ? successIllu : failIllu)});
  margin-top: 84px;
  width: 150px;
  height: 132px;
`;

export function Result({ sendEvent, t, meta, state }) {
  const result = state.context.results[state.value];

  console.log(result, meta);
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
      <Button primary onClick={() => sendEvent("NEXT")}>
        {t("onboarding.quizz.buttons.next")}
      </Button>
    </React.Fragment>
  );
}
