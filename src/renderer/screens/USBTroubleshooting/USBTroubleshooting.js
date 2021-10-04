// @flow
import React, { useState, useCallback, useMemo, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ConnectionTester from "./ConnectionTester";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { useMachine } from "@xstate/react";
import { USBTroubleshootingIndexSelector } from "~/renderer/reducers/settings";
import USBTroubleshootingMachine from "./USBTroubleshootingMachine";
import Intro from "./solutions/Intro";
import ArrowRightIcon from "~/renderer/icons/ArrowRight";
import RepairFunnel from "./solutions/RepairFunnel";
import { useHistory, useLocation } from "react-router-dom";
import { setUSBTroubleshootingIndex } from "~/renderer/actions/settings";

const StepWrapper = styled(Box).attrs({
  horizontal: true,
  justifyContent: "space-between",
  mt: 32,
})`
  position: absolute;
  ${p =>
    p.onboarding
      ? `
  left: 0;
  margin: 0 20px;
  bottom: 20px;
  width: calc(100% - 40px);
  `
      : `
  bottom: 12px;
  width: 100%;
  `}
`;

const USBTroubleshooting = ({ onboarding = false }: { onboarding?: boolean }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { state: locationState } = useLocation();
  const fallBackUSBTroubleshootingIndex = useSelector(USBTroubleshootingIndexSelector);

  // Maybe extract an index from the state, fallback to selector
  let { USBTroubleshootingIndex } = locationState || {};
  USBTroubleshootingIndex = USBTroubleshootingIndex ?? fallBackUSBTroubleshootingIndex;

  // Show the splash screen only if we are not already mid troubleshooting
  const [showIntro, setShowIntro] = useState(USBTroubleshootingIndex === undefined);

  const [state, sendEvent] = useMachine(USBTroubleshootingMachine, {
    context: { currentIndex: USBTroubleshootingIndex },
  });
  const { context } = state || {};
  const { currentIndex, solutions, SolutionComponent, platform, done } = context;

  const platformSolutions = solutions[platform];
  const isLastStep = useMemo(() => SolutionComponent === RepairFunnel, [SolutionComponent]);

  useEffect(() => {
    dispatch(setUSBTroubleshootingIndex(currentIndex));
  }, [currentIndex, dispatch]);

  // Nb reset the index if we navigate away
  useEffect(() => () => dispatch(setUSBTroubleshootingIndex()), [dispatch]);

  const onExit = useCallback(() => {
    dispatch(setUSBTroubleshootingIndex());
    history.push({ pathname: onboarding ? "/" : "/manager" });
  }, [dispatch, history, onboarding]);

  const onDone = useCallback(() => {
    sendEvent("DONE");
  }, [sendEvent]);

  const showExitOnboardingButton = onboarding && !currentIndex;

  return showIntro ? (
    <Intro onStart={() => setShowIntro(false)} onBack={onExit} />
  ) : (
    <Box p={onboarding ? 48 : 0}>
      <SolutionComponent number={currentIndex + 1} sendEvent={sendEvent} done={done} />
      {!isLastStep && <ConnectionTester onExit={onExit} onDone={onDone} />}
      {!done && (
        <StepWrapper onboarding={onboarding}>
          {showExitOnboardingButton ? (
            <Button onClick={onExit} id="USBTroubleshooting-backToOnboarding">
              <ArrowRightIcon flipped size={16} />
              <Text ml={1}>{t("connectTroubleshooting.steps.entry.back")}</Text>
            </Button>
          ) : (
            <Button
              disabled={!currentIndex}
              onClick={() => sendEvent("PREVIOUS")}
              id="USBTroubleshooting-previous"
            >
              <ArrowRightIcon flipped size={16} />
              <Text ml={1}>{t("connectTroubleshooting.previousSolution")}</Text>
            </Button>
          )}
          {!isLastStep && (
            <Button
              disabled={currentIndex === platformSolutions.length - 1}
              onClick={() => sendEvent("NEXT")}
              id="USBTroubleshooting-next"
            >
              <Text mr={1}>{t("connectTroubleshooting.nextSolution")}</Text>
              <ArrowRightIcon size={16} />
            </Button>
          )}
        </StepWrapper>
      )}
    </Box>
  );
};

export default USBTroubleshooting;
