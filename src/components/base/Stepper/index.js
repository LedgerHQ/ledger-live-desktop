// @flow

import React, { PureComponent, Fragment } from 'react'
import invariant from 'invariant'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { ModalBody } from 'components/base/Modal'
import Breadcrumb from 'components/Breadcrumb'

type Props = {
  t: T,
  title: string,
  steps: Step[],
  initialStepId: string,
  hideBreadcrumb?: boolean,
  onClose: void => void,
  onStepChange?: Step => void,
  disabledSteps?: number[],
  errorSteps?: number[],
  children: any,
  error?: Error,
  signed?: boolean,
}

export type Step = {
  id: string,
  label: string,
  excludeFromBreadcrumb?: boolean,
  component: StepProps => React$Node,
  footer: StepProps => React$Node,
  shouldRenderFooter?: StepProps => boolean,
  shouldPreventClose?: boolean | (StepProps => boolean),
  onBack?: StepProps => void,
  noScroll?: boolean,
}

type State = {
  stepId: string,
}

export type StepProps = {
  t: T,
  transitionTo: string => void,
}

class Stepper extends PureComponent<Props, State> {
  state = {
    stepId: this.props.initialStepId,
  }

  transitionTo = stepId => {
    const { onStepChange, steps } = this.props
    this.setState({ stepId })
    if (onStepChange) {
      const stepIndex = steps.findIndex(s => s.id === stepId)
      const step = steps[stepIndex]
      if (step) {
        onStepChange(step)
      }
    }
  }

  render() {
    const {
      t,
      hideBreadcrumb,
      steps,
      title,
      onClose,
      disabledSteps,
      errorSteps,
      children,
      ...props
    } = this.props
    const { stepId } = this.state

    const stepIndex = steps.findIndex(s => s.id === stepId)
    const step = steps[stepIndex]

    invariant(
      !(step.excludeFromBreadcrumb && stepIndex === 0),
      `Stepper: First step cannot be excluded`,
    )

    const { index: breadcrumbStepIndex, offset } = steps
      .slice(0, stepIndex + 1)
      .reduce(
        (result, step, index) =>
          step.excludeFromBreadcrumb
            ? { ...result, offset: result.offset + 1 }
            : { ...result, index },
        { offset: 0, index: 0 },
      )

    const realIndex = step.excludeFromBreadcrumb
      ? breadcrumbStepIndex
      : breadcrumbStepIndex - offset

    invariant(step, `Stepper: step ${stepId} doesn't exists`)

    const {
      component: StepComponent,
      footer: StepFooter,
      onBack,
      shouldPreventClose,
      shouldRenderFooter,
      noScroll,
    } = step

    const stepProps: StepProps = {
      t,
      transitionTo: this.transitionTo,
      ...props,
    }

    const renderFooter =
      !!StepFooter && (shouldRenderFooter === undefined || shouldRenderFooter(stepProps))

    const preventClose =
      typeof shouldPreventClose === 'function'
        ? shouldPreventClose(stepProps)
        : !!shouldPreventClose

    return (
      <ModalBody
        refocusWhenChange={stepId}
        onClose={preventClose ? undefined : onClose}
        onBack={onBack ? () => onBack(stepProps) : undefined}
        title={title}
        noScroll={noScroll}
        render={() => (
          <Fragment>
            {!hideBreadcrumb && (
              <Breadcrumb
                mb={props.error && props.signed ? 4 : 6}
                currentStep={realIndex}
                items={steps.filter(s => !s.excludeFromBreadcrumb)}
                stepsDisabled={disabledSteps}
                stepsErrors={errorSteps}
              />
            )}
            <StepComponent {...stepProps} />
            {children}
          </Fragment>
        )}
        renderFooter={renderFooter ? () => <StepFooter {...stepProps} /> : undefined}
      />
    )
  }
}

export default translate()(Stepper)
