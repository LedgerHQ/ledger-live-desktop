// @flow
import React, { useCallback, useState, useMemo } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import useTheme from "~/renderer/hooks/useTheme";
import BadgeLabel from "~/renderer/components/BadgeLabel";
import Color from "color";

type Props = {
  name?: string,
  category: string,
  trackName: string,
  illuBgColor?: string,
  steps: {
    illustration: React$Node,
    title?: React$Node,
    subtitle?: React$Node,
    description?: React$Node,
    onFinish?: () => void,
    footer?: React$Node,
    continueDisabled?: boolean,
    previousDisabled?: boolean,
  }[],
  ...
};

export default function TutorialModal({
  name,
  category,
  trackName,
  illuBgColor,
  steps,
  ...rest
}: Props) {
  const bg = useTheme("colors.palette.background.default");
  const bgColor = Color(illuBgColor || bg).darken(0.06);

  const [currentStep, setCurrentStep] = useState(0);

  const step = useMemo(() => steps[currentStep] || steps[0], [steps, currentStep]);

  const onNext = useCallback(() => {
    if (step && typeof step.onFinish === "function") {
      step.onFinish();
    }
    setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
  }, [step, steps, currentStep]);

  const onPrevious = useCallback(() => {
    setCurrentStep(Math.max(0, currentStep - 1));
  }, [currentStep]);

  return (
    <Modal
      {...rest}
      name={name}
      centered
      render={({ onClose, data }) => (
        <ModalBody
          title={null}
          headerStyle={{ backgroundColor: bgColor, padding: 0 }}
          onClose={onClose}
          noScroll
          render={onClose => (
            <Box flow={4}>
              <TrackPage category={category} name={trackName} />
              <IllustrationSection>
                <IllustrationContainer bgColor={bgColor}>{step.illustration}</IllustrationContainer>
              </IllustrationSection>
              <Box alignItems="center" px={6} mt={6} mb={-4} minHeight={150}>
                <BadgeLabel>{step.title}</BadgeLabel>
                <Box my={2}>
                  <Text ff="Inter|SemiBold" fontSize={4} textAlign="center">
                    {step.subtitle}
                  </Text>
                </Box>

                <Text ff="Inter|Regular" fontSize={3} textAlign="center">
                  {step.description}
                </Text>
              </Box>
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal flex="1 1 0%">
              {step.footer ||
                (step.previousDisabled ? null : (
                  <Button secondary outlineGrey onClick={onPrevious}>
                    <Trans i18nKey="common.previous" />
                  </Button>
                ))}
              <Box grow />
              <Button primary disabled={step.continueDisabled} onClick={onNext}>
                <Trans i18nKey="common.continue" />
              </Button>
            </Box>
          )}
        />
      )}
    />
  );
}

const IllustrationSection = styled.div`
  width: 100%;
  height: 150px;
  position: relative;
  overflow: visible;
`;

const IllustrationContainer = styled.div`
  position: absolute;
  width: calc(100% + ${p => p.theme.space[6]}px);
  height: calc(100% + ${p => p.theme.space[6]}px);
  top: -${p => p.theme.space[4]}px;
  left: -${p => p.theme.space[4]}px;
  background-color: ${p => p.bgColor};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: row;
`;
