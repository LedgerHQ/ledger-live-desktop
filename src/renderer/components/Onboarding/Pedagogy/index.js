// @flow

import React, { useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Wave } from "~/renderer/components/Onboarding/Pedagogy/assets/Wave";
import Text from "~/renderer/components/Text";
import ChevronLeft from "~/renderer/icons/ChevronLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import { useMachine } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import {
  AccessYourCoins,
  OwnYourPrivateKey,
  SetUpNanoWallet,
  StayOffline,
  ValidateTransactions,
} from "~/renderer/components/Onboarding/Pedagogy/screens";
import { pedagogyMachine } from "~/renderer/components/Onboarding/Pedagogy/state";

const PedagogyContainer: ThemedComponent<*> = styled.div`
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
`;

const WaveContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0px;
  display: flex;
`;

const visibleStyle = css`
  opacity: 1;
  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.5;
  }
`;

const notVisibleStyle = css`
  opacity: 0;
  pointer-events: none;
`;

const Button = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-height: 100%;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  color: ${p => p.theme.colors.palette.text.shade80};
  background-color: ${p => p.theme.colors.palette.background.default};
  cursor: pointer;
  transition: opacity 100ms ease-out;
  ${({ visible }) => (visible ? visibleStyle : notVisibleStyle)}
`;

const LeftButton = styled(Button)`
  position: absolute;
  bottom: 24px;
  left: 37px;
`;

const RightButton = styled(Button)`
  position: absolute;
  bottom: 24px;
  right: 37px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
`;

const DURATION = 250;

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  z-index: 1;
  max-width: 334px;

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
  accessYourCoins: AccessYourCoins,
  ownYourPrivateKey: OwnYourPrivateKey,
  stayOffline: StayOffline,
  validateTransactions: ValidateTransactions,
  setUpNanoWallet: SetUpNanoWallet,
};

type PedagogyProps = {
  onDone: () => void,
};

export function Pedagogy({ onDone }: PedagogyProps) {
  const [state, sendEvent] = useMachine(pedagogyMachine, {
    actions: {
      done: onDone,
    },
  });
  const { t } = useTranslation();

  const onKeyPress = useCallback(
    e => {
      if (e.key === "ArrowLeft") {
        sendEvent("PREV");
      } else if (e.key === "ArrowRight") {
        sendEvent("NEXT");
      }
    },
    [sendEvent],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress, false);
    return () => {
      window.removeEventListener("keydown", onKeyPress, false);
    };
  }, [onKeyPress]);

  const CurrentScreen = screens[state.value];

  return (
    <PedagogyContainer data-test-id="onboarding-pedagogy-modal">
      <Text
        mt="72px"
        color="palette.primary.main"
        ff="Inter|Bold"
        fontSize="10px"
        lineHeight="12.1px"
        uppercase
        letterSpacing="0.1em"
      >
        {t("onboarding.pedagogy.heading")}
      </Text>
      <WaveContainer>
        <Wave />
      </WaveContainer>
      <CSSTransition in classNames="screen" timeout={DURATION} key={state.value} appear>
        <ScreenContainer>
          <CurrentScreen t={t} sendEvent={sendEvent} />
        </ScreenContainer>
      </CSSTransition>
      <LeftButton
        data-test-id="pedagogy-left"
        visible={state.nextEvents.includes("PREV")}
        onClick={() => sendEvent("PREV")}
      >
        <ChevronLeft size={16} />
      </LeftButton>
      <RightButton
        data-test-id="pedagogy-right"
        visible={state.nextEvents.includes("NEXT")}
        onClick={() => sendEvent("NEXT")}
      >
        <ChevronRight size={16} />
      </RightButton>
    </PedagogyContainer>
  );
}
