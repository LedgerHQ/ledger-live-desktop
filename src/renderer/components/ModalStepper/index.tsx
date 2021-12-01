import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Popin } from "@ledgerhq/react-ui";
import ModalStepperBody from "./ModalStepperBody";
import CloseButton from "./CloseButton";

type StepProps = {
  title?: string;
  description?: string;
  AsideLeft?: React.ReactNode;
  AsideRight: React.ReactNode;
  bgColor?: string;
  continueLabel?: string;
  backLabel?: string;
  continueDisabled?: boolean;
  hideContinueButton?: boolean;
  backDisabled?: boolean;
  hideBackButton?: boolean;
};

type Props = {
  isOpen: boolean;
  title: string;
  steps: Array<StepProps>;
  onClose: () => void;
  onFinish: () => void;
  dismissable?: boolean;
};

const ModalStepper = (props: Props) => {
  const { title, steps, onClose, onFinish, isOpen, dismissable = true } = props;
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState(0);
  const stepCount = steps.length;
  const step = steps[stepIndex];
  const stepsProps = { stepIndex, stepCount };

  const defaultContinueLabel = t("common.continue");
  const defaultBackLabel = t("common.back");

  const onClickContinue = useCallback(() => {
    if (stepIndex === stepCount - 1) {
      setStepIndex(0);
      onFinish();
    } else {
      setStepIndex(Math.min(stepIndex + 1, stepCount - 1));
    }
  }, [stepIndex, stepCount, onFinish]);

  const onClickBack = useCallback(() => {
    if (stepIndex === 0) onClose();
    else setStepIndex(Math.max(0, stepIndex - 1));
  }, [stepIndex, onClose]);

  const [width, height] = [816, 486];

  return (
    <Popin
      isOpen={isOpen}
      onClose={onClose}
      width={width}
      height={height}
      p={0}
      position="relative"
    >
      <ModalStepperBody
        AsideLeft={step.AsideLeft}
        AsideRight={step.AsideRight}
        backDisabled={step.backDisabled}
        backLabel={step.backLabel || defaultBackLabel}
        continueDisabled={step.continueDisabled}
        continueLabel={step.continueLabel || defaultContinueLabel}
        description={step.description}
        hideBackButton={step.hideBackButton}
        hideContinueButton={step.hideContinueButton}
        onClickBack={onClickBack}
        onClickContinue={onClickContinue}
        rightSideBgColor={step.bgColor}
        stepTitle={step.title}
        title={title}
        {...stepsProps}
      />
      {dismissable && <CloseButton onClick={onClose} />}
    </Popin>
  );
};

export default ModalStepper;
