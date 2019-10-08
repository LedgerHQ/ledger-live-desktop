// @flow

import React, { PureComponent } from 'react'

import Box from 'components/base/Box'
import { delay } from 'helpers/promise'

import {
  DeviceInteractionStepContainer,
  SpinnerContainer,
  IconContainer,
  SuccessContainer,
  ErrorContainer,
} from './components'

export type Step = {
  id: string,
  title?: React$Node | (Object => React$Node),
  desc?: React$Node,
  icon: React$Node,
  run?: Object => Promise<any> | { promise: Promise<any>, unsubscribe: void => any },
  render?: ({ onSuccess: Object => any, onFail: Error => void }, any) => React$Node,
  minMs?: number,
}

type Status = 'idle' | 'running'

type Props = {
  isFirst: boolean,
  isLast: boolean,
  isActive: boolean,
  isFinished: boolean,
  isPrecedentActive: boolean,
  isError: boolean,
  isSuccess: boolean,
  isPassed: boolean,
  step: Step,
  onSuccess: (any, Step) => any,
  onFail: (Error, Step) => any,
  data: any,
}

class DeviceInteractionStep extends PureComponent<
  Props,
  {
    status: Status,
  },
> {
  static defaultProps = {
    data: {},
  }

  state = {
    status: this.props.isFirst ? 'running' : 'idle',
  }

  componentDidMount() {
    if (this.props.isFirst) {
      this.run()
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { isActive, isError } = this.props
    const { status } = this.state

    const didActivated = isActive && !prevProps.isActive
    const didDeactivated = !isActive && prevProps.isActive
    const stillActivated = isActive && prevProps.isActive
    const didResetError = !isError && !!prevProps.isError

    if (didActivated && status !== 'running') {
      this.run()
    }

    if (didResetError && stillActivated) {
      this.run()
    }

    if (didDeactivated && status === 'running') {
      this.cancel()
    }
  }

  componentWillUnmount() {
    if (this._unsubscribe) {
      this._unsubscribe()
    }
    this._unmounted = true
  }

  _unsubscribe = null
  _unmounted = false

  handleSuccess = (res: any) => {
    const { onSuccess, step, isError } = this.props
    if (isError) return
    this.setState({ status: 'idle' })
    onSuccess(res, step)
  }

  handleFail = (e: Error) => {
    const { onFail, step } = this.props
    this.setState({ status: 'idle' })
    onFail(e, step)
  }

  run = async () => {
    const { step, data } = this.props
    const { status } = this.state

    if (status !== 'running') {
      this.setState({ status: 'running' })
    }

    if (!step.run) {
      return
    }

    try {
      const d1 = Date.now()

      // $FlowFixMe JUST TESTED THE `run` 6 LINES BEFORE!!!
      const res = (await step.run(data)) || {}
      if (this._unmounted) return

      if (step.minMs) {
        const d2 = Date.now()
        // $FlowFixMe SAME THING, JUST TESTED THE MINMS KEY, BUT EH
        if (d2 - d1 < step.minMs) {
          // $FlowFixMe nice type checking
          await delay(step.minMs - (d2 - d1))
          if (this._unmounted) return
        }
      }
      if (res.promise) {
        this._unsubscribe = res.unsubscribe
        const realRes = await res.promise
        if (this._unmounted) return
        this.handleSuccess(realRes)
      } else {
        this.handleSuccess(res)
      }
    } catch (e) {
      this.handleFail(e)
    }
  }

  cancel = () => this.setState({ status: 'idle' })

  render() {
    const {
      isFirst,
      isLast,
      isActive,
      isFinished,
      isPrecedentActive,
      isSuccess,
      isError,
      isPassed,
      step,
      data,
    } = this.props

    const { status } = this.state
    const title = typeof step.title === 'function' ? step.title(data) : step.title
    const { render: CustomRender } = step
    const isRunning = status === 'running'

    return (
      <DeviceInteractionStepContainer
        isFirst={isFirst}
        isLast={isLast}
        isFinished={isFinished}
        isSuccess={isSuccess}
        isActive={isActive}
        isPrecedentActive={isPrecedentActive}
        isError={isError}
      >
        <IconContainer isTransparent={!isActive && !isSuccess}>{step.icon}</IconContainer>
        <Box py={4} justify="center" grow shrink>
          {title && (
            <Box color={isActive || isSuccess ? 'palette.text.shade100' : ''} ff="Inter|Regular">
              {title}
            </Box>
          )}
          {step.desc && step.desc}
          {CustomRender && (
            <CustomRender onSuccess={this.handleSuccess} onFail={this.handleFail} data={data} />
          )}
        </Box>

        <div style={{ width: 70, position: 'relative', overflow: 'hidden', pointerEvents: 'none' }}>
          <SpinnerContainer isVisible={isRunning} isPassed={isPassed} isError={isError} />
          <ErrorContainer isVisible={isError} />
          <SuccessContainer isVisible={isSuccess} />
        </div>
      </DeviceInteractionStepContainer>
    )
  }
}

export default DeviceInteractionStep
