import { Flex, Aside, Logos, Button, Icons, ProgressBar } from "@ledgerhq/react-ui";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const FlowStepperContainer = styled(Flex)`
  width: 100%;
  height: 100%;
`;

const FlowStepperContentContainer = styled(Flex)`
  height: 100%;
  padding: ${p => p.theme.space[10]}px;
`;

const FlowStepperContent = styled(Flex)`
  width: 514px;
  height: 100%;
`;

const StepContent = styled.div`
  flex-grow: 1;
  margin-top: ${p => p.theme.space[10]}px;
  margin-bottom: ${p => p.theme.space[10]}px;
  width: 100%;
`;

type Step = {
  Illustration?: React.ReactNode;
  Content?: React.ReactNode;
  AsideFooter?: React.ReactNode;
  title: string;
  key: string;
  continueLabel?: string;
  backLabel?: string;
  disableContinue?: boolean;
  disableBack?: boolean;
};

type FlowStepperProps = {
  steps: Step[];
  currentIndex: number;
  onBack?: () => void;
  onContinue?: () => void;
};

const FlowStepper: React.FC<FlowStepperProps> = ({ steps, onBack, onContinue, currentIndex }) => {
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  const handleContinue = useCallback(() => {
    if (onContinue) {
      onContinue();
    }
  }, [onContinue]);

  const { t } = useTranslation();

  return (
    <FlowStepperContainer>
      <Aside
        backgroundColor="palette.primary.c60"
        header={
          <Flex justifyContent="center">
            <Logos.LedgerLiveRegular />
          </Flex>
        }
        footer={steps[currentIndex].AsideFooter}
        width="324px"
        p={10}
      >
        {steps[currentIndex].Illustration}
      </Aside>
      <FlowStepperContentContainer flexGrow={1} justifyContent="center">
        <FlowStepperContent flexDirection="column">
          <ProgressBar
            currentIndex={currentIndex}
            steps={steps.map(({ title, key }) => ({ key, label: title }))}
          />
          <StepContent>{steps[currentIndex].Content}</StepContent>
          <Flex justifyContent="space-between">
            <Button
              iconPosition="left"
              onClick={handleBack}
              disabled={steps[currentIndex].disableBack}
              type="main"
              outline
              Icon={() => <Icons.ArrowLeftMedium size={18} />}
            >
              {steps[currentIndex].backLabel ?? t("common.back")}
            </Button>
            <Button
              onClick={handleContinue}
              disabled={steps[currentIndex].disableContinue}
              type="main"
              Icon={() => <Icons.ArrowRightMedium size={18} />}
            >
              {steps[currentIndex].continueLabel ?? t("common.continue")}
            </Button>
          </Flex>
        </FlowStepperContent>
      </FlowStepperContentContainer>
    </FlowStepperContainer>
  );
};

export default FlowStepper;
