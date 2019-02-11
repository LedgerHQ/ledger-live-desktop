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
  onClose: void => void,
  onStepChange?: Step => void,
  disabledSteps?: number[],
  errorSteps?: number[],
  children: any,
}

export type Step = {
  id: string,
  label: string,
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
    const { t, steps, title, onClose, disabledSteps, errorSteps, children, ...props } = this.props
    const { stepId } = this.state

    const stepIndex = steps.findIndex(s => s.id === stepId)
    const step = steps[stepIndex]

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
            <Breadcrumb
              mb={6}
              currentStep={stepIndex}
              items={steps}
              stepsDisabled={disabledSteps}
              stepsErrors={errorSteps}
            />
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
