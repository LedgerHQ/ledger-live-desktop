// @flow

import React, { PureComponent } from 'react'

import { delay } from 'helpers/promise'

import Box from 'components/base/Box'
import DeviceInteractionStep from './DeviceInteractionStep'
import { ErrorDescContainer } from './components'

import type { Step } from './DeviceInteractionStep'

type Props = {
  steps: Step[],
  onSuccess?: any => void,
  onFail?: any => void,
  waitBeforeSuccess?: number,
  onTimeoutClick?: () => void,

  // when true and there is an error, display the error + retry button
  shouldRenderRetry?: boolean,
}

type State = {
  stepIndex: number,
  isSuccess: boolean,
  error: ?Error,
  data: Object,
}

const INITIAL_STATE = {
  stepIndex: 0,
  isSuccess: false,
  error: null,
  data: {},
}

class DeviceInteraction extends PureComponent<Props, State> {
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
      this.setState({ isSuccess: true, data })
      if (waitBeforeSuccess) {
        await delay(waitBeforeSuccess)
        if (this._unmounted) return
        onSuccess && onSuccess(data)
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

  handleTimeoutClick = () => {
    const { onTimeoutClick } = this.props
    onTimeoutClick && onTimeoutClick()
  }
  render() {
    const { steps, shouldRenderRetry, ...props } = this.props
    const { stepIndex, error, isSuccess, data } = this.state

    return (
      <Box {...props}>
        {steps.map((step, i) => {
          const isError = !!error && i === stepIndex
          return (
            <DeviceInteractionStep
              key={step.id}
              step={step}
              isError={isError}
              isFirst={i === 0}
              isLast={i === steps.length - 1}
              isPrecedentActive={i === stepIndex - 1}
              isActive={i === stepIndex}
              isPassed={i < stepIndex}
              isSuccess={i < stepIndex || (i === stepIndex && isSuccess)}
              isFinished={isSuccess}
              onSuccess={this.handleSuccess}
              onFail={this.handleFail}
              onTimeoutClick={this.handleTimeoutClick}
              data={data}
            />
          )
        })}
        {error &&
          shouldRenderRetry && <ErrorDescContainer error={error} onRetry={this.reset} mt={4} />}
      </Box>
    )
  }
}

export default DeviceInteraction
