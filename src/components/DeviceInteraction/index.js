// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { delay } from 'helpers/promise'

import Box from 'components/base/Box'
import DeviceInteractionStep from './DeviceInteractionStep'

import type { Step } from './DeviceInteractionStep'

const INITIAL_STATE = {
  stepIndex: 0,
  isSuccess: false,
  showSuccess: false,
  error: null,
  data: {},
}

class DeviceInteraction extends PureComponent<
  {
    steps: Step[],
    onSuccess?: any => void,
    onFail?: any => void,
    renderSuccess?: any => any,
    waitBeforeSuccess?: number,
  },
  {
    stepIndex: number,
    isSuccess: boolean,
    // used to be able to display the last check for a small amount of time
    showSuccess: boolean,
    error: ?Error,
    data: Object,
  },
> {
  state = INITIAL_STATE

  componentWillUnmount() {
    this._unmounted = true
  }

  _unmounted = false

  reset = () => this.setState(INITIAL_STATE)

  handleSuccess = async (res: any, step: Step) => {
    const { onSuccess, steps, waitBeforeSuccess } = this.props
    const { stepIndex, data: prevData } = this.state
    const isCurrentStep = step.id === steps[stepIndex].id
    if (!isCurrentStep) {
      return
    }
    const data = { ...prevData, [step.id]: res || true }
    const isLast = stepIndex === steps.length - 1
    if (isLast) {
      if (!waitBeforeSuccess) {
        onSuccess && onSuccess(data)
      }
      this.setState({ isSuccess: true, data, showSuccess: !waitBeforeSuccess })
      if (waitBeforeSuccess) {
        await delay(waitBeforeSuccess)
        if (this._unmounted) return
        onSuccess && onSuccess(data)
        this.setState({ showSuccess: true })
      }
    } else {
      this.setState({ stepIndex: stepIndex + 1, data })
    }
  }

  handleFail = (error: Error, step: Step) => {
    const { steps, onFail } = this.props
    const { stepIndex } = this.state
    const isCurrentStep = step === steps[stepIndex]
    if (!isCurrentStep) {
      return
    }
    this.setState({ error })
    onFail && onFail(error)
  }

  render() {
    const { steps, renderSuccess, waitBeforeSuccess: _waitBeforeSuccess, ...props } = this.props
    const { stepIndex, error, isSuccess, data, showSuccess } = this.state

    return (
      <DeviceInteractionContainer {...props}>
        {isSuccess && showSuccess && renderSuccess
          ? renderSuccess(data)
          : steps.map((step, i) => {
              const isError = !!error && i === stepIndex
              return (
                <DeviceInteractionStep
                  key={step.id}
                  step={step}
                  error={isError ? error : null}
                  isError={isError}
                  isFirst={i === 0}
                  isLast={i === steps.length - 1}
                  isPrecedentActive={i === stepIndex - 1}
                  isActive={i === stepIndex}
                  isPassed={i < stepIndex}
                  isSuccess={i < stepIndex || (i === stepIndex && isSuccess)}
                  onSuccess={this.handleSuccess}
                  onFail={this.handleFail}
                  onRetry={this.reset}
                  data={data}
                />
              )
            })}
      </DeviceInteractionContainer>
    )
  }
}

const DeviceInteractionContainer = styled(Box).attrs({})``

export default DeviceInteraction
