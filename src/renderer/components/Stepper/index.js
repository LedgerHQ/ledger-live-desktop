// @flow

import React, { useCallback, useMemo } from "react";
import invariant from "invariant";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import { ModalBody } from "~/renderer/components/Modal";
import { useDeviceBlocked } from "~/renderer/components/DeviceAction/DeviceBlocker";
import Breadcrumb from "./Breadcrumb";

export type BasicStepProps = {
  t: TFunction,
  transitionTo: string => void,
};

export type Step<T, StepProps> = {
  id: T,
  label?: React$Node,
  excludeFromBreadcrumb?: boolean,
  component: React$ComponentType<StepProps>,
  footer?: React$ComponentType<StepProps>,
  onBack?: ?(StepProps) => void,
  noScroll?: boolean,
};

type Props<T, StepProps> = {
  t: TFunction,
  title?: React$Node,
  stepId: T,
  onStepChange: (Step<T, StepProps>) => void,
  steps: Step<T, StepProps>[],
  hideBreadcrumb?: boolean,
  onClose: void => void,
  disabledSteps?: number[],
  errorSteps?: number[],
  children: any,
  error?: ?Error,
  signed?: boolean,
  children?: React$Node,
  params?: any,
};

const Stepper = <T, StepProps>({
  stepId,
  steps,
  onStepChange,
  t,
  hideBreadcrumb,
  title,
  onClose,
  disabledSteps,
  errorSteps,
  children,
  ...props
}: Props<T, StepProps>) => {
  const deviceBlocked = useDeviceBlocked();

  const transitionTo = useCallback(
    stepId => {
      const stepIndex = steps.findIndex(s => s.id === stepId);
      const step = steps[stepIndex];
      invariant(step, "Stepper: step %s doesn't exists", stepId);
      onStepChange(step);
    },
    [onStepChange, steps],
  );

  const { step, visibleSteps, indexVisible } = useMemo(() => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const step = steps[stepIndex];

    const visibleSteps = steps.filter(s => !s.excludeFromBreadcrumb);
    const indexVisible = Math.min(
      steps.slice(0, stepIndex).filter(s => !s.excludeFromBreadcrumb).length,
      visibleSteps.length - 1,
    );

    return { step, visibleSteps, indexVisible };
  }, [stepId, steps]);

  invariant(step, "Stepper: step %s doesn't exists", stepId);

  const { component: StepComponent, footer: StepFooter, onBack, noScroll } = step;

  // $FlowFixMe we'll need to improve this. also ...props is bad practice...
  const stepProps: StepProps = {
    ...props,
    onClose,
    t,
    transitionTo,
  };

  return (
    <ModalBody
      refocusWhenChange={stepId}
      onClose={deviceBlocked ? undefined : onClose}
      onBack={onBack && !deviceBlocked ? () => onBack(stepProps) : undefined}
      title={title}
      noScroll={noScroll}
      render={() => (
        <>
          {hideBreadcrumb ? null : (
            <Breadcrumb
              mb={props.error && props.signed ? 4 : 6}
              currentStep={indexVisible}
              items={visibleSteps}
              stepsDisabled={disabledSteps}
              stepsErrors={errorSteps}
            />
          )}
          <StepComponent {...stepProps} />
          {children}
        </>
      )}
      renderFooter={StepFooter ? () => <StepFooter {...stepProps} /> : undefined}
    />
  );
};

export default withTranslation()(Stepper);
