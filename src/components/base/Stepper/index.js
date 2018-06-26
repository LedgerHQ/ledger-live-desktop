// @flow

import React, { PureComponent } from 'react'
import invariant from 'invariant'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { ModalContent, ModalTitle, ModalFooter, ModalBody } from 'components/base/Modal'
import Breadcrumb from 'components/Breadcrumb'

type Props = {
  t: T,
  title: string,
  initialStepId: string,
  onClose: void => void,
  steps: Step[],
  children: any,
}

export type Step = {
  id: string,
  label: string,
  component: StepProps => React$Node,
  footer: StepProps => React$Node,
  preventClose?: boolean,
  onBack?: StepProps => void,
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

  transitionTo = stepId => this.setState({ stepId })

  render() {
    const { t, steps, title, onClose, children, ...props } = this.props
    const { stepId } = this.state

    const stepIndex = steps.findIndex(s => s.id === stepId)
    const step = steps[stepIndex]

    invariant(step, `Stepper: step ${stepId} doesn't exists`)

    const { component: StepComponent, footer: StepFooter, onBack, preventClose } = step

    const stepProps: StepProps = {
      t,
      transitionTo: this.transitionTo,
      ...props,
    }

    return (
      <ModalBody onClose={preventClose ? undefined : onClose}>
        <ModalTitle onBack={onBack ? () => onBack(stepProps) : undefined}>{title}</ModalTitle>
        <ModalContent>
          <Breadcrumb mb={6} currentStep={stepIndex} items={steps} />
          <StepComponent {...stepProps} />
          {children}
        </ModalContent>
        {StepFooter && (
          <ModalFooter horizontal align="center" justify="flex-end">
            <StepFooter {...stepProps} />
          </ModalFooter>
        )}
      </ModalBody>
    )
  }
}

export default translate()(Stepper)
