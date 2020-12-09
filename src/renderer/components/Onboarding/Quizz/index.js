// @flow

import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Question } from "./screens/Question";
import { Result } from "./screens/Result";
import { Intro } from "./screens/Intro";
import { quizzMachine } from "~/renderer/components/Onboarding/Quizz/state";

const DURATION = 250;

const ScreenContainer = styled.div`
  text-align: center;
  position: relative;
  flex-direction: column;
  align-items: center;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0px 67px;

  &.screen-appear {
    opacity: 0;
  }

  &.screen-appear-active {
    opacity: 1;
    transition: opacity ${DURATION}ms ease-in;
  }

  &.screen-enter {
    opacity: 0;
  }

  &.screen-enter-active {
    opacity: 1;
    transition: opacity ${DURATION}ms ease-in;
  }

  &.screen-exit {
    display: none;
  }
`;

const QuizzContainer: ThemedComponent<*> = styled.div`
  box-sizing: border-box;
  width: 680px;
  height: 480px;
  background-color: ${p => p.theme.colors.palette.background.default};
  display: flex;
  overflow: hidden;
`;

const screens = {
  question: Question,
  result: Result,
  intro: Intro,
};

type QuizzProps = {
  onWin: () => void,
  onLose: () => void,
};

function mergeMeta(meta) {
  return Object.keys(meta).reduce((acc, key) => {
    const value = meta[key];

    Object.assign(acc, value);

    return acc;
  }, {});
}

export function Quizz({ onWin, onLose }: QuizzProps) {
  const [state, sendEvent] = useMachine(quizzMachine, {
    actions: {
      onWin,
      onLose,
    },
  });

  const meta = mergeMeta(state.meta);
  const { t } = useTranslation();

  const CurrentScreen = screens[meta.UI];

  if (!CurrentScreen) {
    return null;
  }

  return (
    <QuizzContainer>
      <CSSTransition in classNames="screen" timeout={DURATION} key={state.value} appear>
        <ScreenContainer>
          <CurrentScreen t={t} sendEvent={sendEvent} meta={meta} state={state} />
        </ScreenContainer>
      </CSSTransition>
    </QuizzContainer>
  );
}
