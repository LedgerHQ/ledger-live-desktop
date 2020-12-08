// @flow

import React from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";

import quizSuccess from "../assets/quizSuccess.svg";
import { useTranslation } from "react-i18next";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import { ContentContainer, Illustration } from "../shared";

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

export function QuizSuccess({ sendEvent, context }) {
  const { t } = useTranslation();
  console.log(context);

  return (
    <ScreenContainer>
      <ContentContainer>
        <Illustration width={270} height={213} src={quizSuccess} />
        <Text
          mt="32px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="32px"
          lineHeight="38.73px"
        >
          {t("onboarding.screens.tutorial.screens.quizSuccess.title")}
        </Text>
        <Text
          mt="32px"
          mb="40px"
          color="palette.primary.contrastText"
          ff="Inter|SemiBold"
          fontSize="18px"
          lineHeight="21.78px"
        >
          {t("onboarding.screens.tutorial.screens.quizSuccess.paragraph")}
        </Text>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.primary.contrastText" onClick={() => sendEvent("PREV")}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.quizSuccess.buttons.prev")}
          </Text>
        </Button>
        <Button
          inverted
          primary
          onClick={() => sendEvent("NEXT")}
        >
          <Text mr="12px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.quizSuccess.buttons.next")}
          </Text>
          <ChevronRight size={12} />
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
