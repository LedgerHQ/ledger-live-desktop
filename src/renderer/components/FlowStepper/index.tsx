import { Flex, Aside, Logos, Text, Button, Icons } from "@ledgerhq/react-ui";
import React, { useCallback } from "react";
import styled from "styled-components";

const FlowStepperContainer = styled(Flex)`
  width: 100%;
  height: 100%;
`;

const FlowStepperContent = styled(Flex)`
  height: 100%;
  padding: ${p => p.theme.space[10]}px;
`;

type Step = {
  Illustration?: React.ReactNode;
  continueLabel?: string;
  backLabel?: string;
  disableContinue?: boolean;
};

type FlowStepperProps = {
  steps: Step[];
  onStepChange?: (step: number) => void;
  onComplete: () => void;
};

const FlowStepper: React.FC<FlowStepperProps> = ({ steps, onStepChange, onComplete }) => {
  const [step, setStep] = React.useState(0);

  const handleBack = useCallback(() => {
    setStep(step - 1);
    onStepChange && onStepChange(step - 1);
  }, [step, onStepChange]);

  const handleContinue = useCallback(() => {
    if (step <= steps.length - 1) {
      setStep(step + 1);
      onStepChange && onStepChange(step + 1);
    } else {
      onComplete();
    }
  }, [step, onStepChange, onComplete, steps]);

  return (
    <FlowStepperContainer>
      <Aside
        backgroundColor="palette.primary.c60"
        header={
          <Flex justifyContent="center">
            <Logos.LedgerLiveRegular />
          </Flex>
        }
        footer={
          <Flex flexDirection="column" rowGap={3}>
            <Flex alignItems="center" columnGap={3}>
              <Text ff="Inter|Medium" fontSize={4}>
                Need help?
              </Text>
              <Icons.LifeRingMedium size={20} />
            </Flex>
            <Text ff="Inter|Medium" fontSize={3}>
              Don’t know what you have to do? Get some help to close this step.
            </Text>
            <div />
          </Flex>
        }
        width="324px"
        p={10}
      ></Aside>
      <FlowStepperContent flexGrow={1}>
        <Flex alignSelf="flex-end" justifyContent="space-between" flexGrow={1} columnGap={20}>
          <Button
            iconPosition="left"
            onClick={handleBack}
            disabled={step === 0}
            type="main"
            outline
            Icon={() => <Icons.ArrowLeftMedium size={18} />}
          >
            {steps[step].backLabel ?? "Back"}
          </Button>
          {/* TODO: change the default labels by translated ones */}
          <Button
            onClick={handleContinue}
            disabled={steps[step].disableContinue}
            type="main"
            Icon={() => <Icons.ArrowRightMedium size={18} />}
          >
            {steps[step].continueLabel ?? "Continue"}
          </Button>
        </Flex>
      </FlowStepperContent>
    </FlowStepperContainer>
  );
};

export default FlowStepper;
