import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import FlexBox from "@ledgerhq/react-ui/components/layout/Flex";
import { Button, Popin } from "@ledgerhq/react-ui";
import { CloseRegular } from "@ledgerhq/icons-ui/react";
import ProgressBar from "./ProgressBar";
import StepLeftSide from "./StepLeftSide";
import StepRightSide from "./StepRightSide";
import ProgressHeader from "./ProgressHeader";

const CloseButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const StepContainer = styled(FlexBox).attrs(() => ({
  flexDirection: "row",
  justifyContent: "space-between",
  position: "relative",
}))`
  flex: 1;
  height: 100%;
`;

type StepProps = {
  title?: string;
  description?: string;
  AsideLeft?: React.ReactNode;
  AsideRight: React.ReactNode;
  bgColor?: string;
  continueLabel?: string;
  backLabel?: string;
  continueDisabled?: boolean;
  backDisabled?: boolean;
};

type Props = {
  isOpen: boolean;
  title: string;
  steps: Array<StepProps>;
  onClose: (...args: any) => any;
  onFinish: (...args: any) => any;
};

const ModalStepper = (props: Props) => {
  const { title, steps, onClose, onFinish, isOpen } = props;
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState(0);
  const stepCount = steps.length;
  const step = steps[stepIndex];
  const stepsProps = { stepIndex, stepCount };

  const defaultContinueLabel = t("common.continue");
  const defaultBackLabel = t("common.back");

  const onClickContinue = useCallback(() => {
    if (stepIndex === stepCount - 1) onFinish();
    setStepIndex(Math.min(stepIndex + 1, stepCount - 1));
  }, [stepIndex, stepCount, onFinish]);

  const onClickBack = useCallback(() => {
    if (stepIndex === 0) onClose();
    else setStepIndex(Math.max(0, stepIndex - 1));
  }, [stepIndex, onClose]);

  return (
    <Popin isOpen={isOpen} onClose={onClose} width={816} height={486}>
      <StepContainer>
        <StepLeftSide
          Header={<ProgressHeader title={title} {...stepsProps} />}
          title={step.title}
          description={step.description}
          AsideLeft={step.AsideLeft}
          continueLabel={step.continueLabel || defaultContinueLabel}
          backLabel={step.backLabel || defaultBackLabel}
          continueDisabled={step.continueDisabled}
          backDisabled={step.backDisabled}
          {...{ onClickContinue, onClickBack }}
        />
        <StepRightSide AsideRight={step.AsideRight} bgColor={step.bgColor} />
        <ProgressBar {...stepsProps} />
      </StepContainer>
    </Popin>
  );
};

export default ModalStepper;
