// @flow

import React, { useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import { useActor } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import { Question } from "./screens/Question";
import { Result } from "./screens/Result";

const DURATION = 250;

const QuizzContainer = styled.div`
  box-sizing: border-box;
  padding: 0px 67px;
  width: 680px;
  height: 480px;
  background-color: ${p => p.theme.colors.palette.background.default};
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  text-align: center;

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

const screens = {
  question: Question,
  result: Result,
};

type QuizzProps = {
  actor: any,
};

function mergeMeta(meta) {
  return Object.keys(meta).reduce((acc, key) => {
    const value = meta[key];

    Object.assign(acc, value);

    return acc;
  }, {});
}

export function Quizz({ actor }: QuizzProps) {
  const [state, sendEvent] = useActor(actor);

  const meta = mergeMeta(state.meta);
  const { t } = useTranslation();

  const CurrentScreen = screens[meta.UI];

  if (!CurrentScreen) {
    return null;
  }

  return (
    <CSSTransition in classNames="screen" timeout={DURATION} key={state.value} appear>
      <QuizzContainer>
        <CurrentScreen t={t} sendEvent={sendEvent} meta={meta} state={state} />
      </QuizzContainer>
    </CSSTransition>
  );
}
