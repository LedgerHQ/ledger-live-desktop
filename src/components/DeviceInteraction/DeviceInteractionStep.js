// @flow

import React, { PureComponent } from 'react'

import Box from 'components/base/Box'
import { delay } from 'helpers/promise'

import {
  DeviceInteractionStepContainer,
  SpinnerContainer,
  IconContainer,
  SuccessContainer,
  ErrorDescContainer,
  ErrorContainer,
} from './components'

export type Step = {
  id: string,
  title: string | (Object => string),
  desc?: string | React$Node,
  icon: React$Node,
  run?: Object => Promise<any> | { promise: Promise<any>, unsubscribe: void => any },
  render?: (
    { onSuccess: Object => any, onFail: Error => void, onRetry: void => void },
    any,
  ) => React$Node,
  minMs?: number,
}

type Status = 'idle' | 'running'

type Props = {
  isFirst: boolean,
  isLast: boolean,
  isActive: boolean,
  isPrecedentActive: boolean,
  isError: boolean,
  isSuccess: boolean,
  isPassed: boolean,
  step: Step,
  error: ?Error,
  onSuccess: (any, Step) => any,
  onFail: (Error, Step) => any,
  onRetry: void => any,
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

  constructor(props: Props) {
    super(props)
    const { isFirst } = this.props
    if (isFirst) {
      // cf: __IS_MOUNTED__THX_FOR_REMOVING_COMPONENTWILLMOUNT__
      this.state.status = 'running'

      this.run()
    }
  }

  state = {
    status: 'idle',
  }

  componentDidMount() {
    this.__IS_MOUNTED__THX_FOR_REMOVING_COMPONENTWILLMOUNT__ = true
  }

  componentDidUpdate(prevProps: Props) {
    const { isActive, error } = this.props
    const { status } = this.state

    const didActivated = isActive && !prevProps.isActive
    const didDeactivated = !isActive && prevProps.isActive
    const stillActivated = isActive && prevProps.isActive
    const didResetError = !error && !!prevProps.error

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

  __IS_MOUNTED__THX_FOR_REMOVING_COMPONENTWILLMOUNT__ = false
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

    if (this.__IS_MOUNTED__THX_FOR_REMOVING_COMPONENTWILLMOUNT__) {
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
      isPrecedentActive,
      isSuccess,
      isError,
      isPassed,
      step,
      error,
      onRetry,
      data,
    } = this.props

    const { status } = this.state

    const title = typeof step.title === 'function' ? step.title(data) : step.title || '[UNTITLED]'

    return (
      <DeviceInteractionStepContainer
        isFirst={isFirst}
        isLast={isLast}
        isSuccess={isSuccess}
        isActive={isActive}
        isPrecedentActive={isPrecedentActive}
        isError={isError}
      >
        <IconContainer>{step.icon}</IconContainer>
        <Box py={4} pr={4} justify="center" grow shrink>
          <Box color={isActive && !isSuccess ? 'dark' : ''} ff="Open Sans|SemiBold">
            {title}
          </Box>
          {step.desc && step.desc}
          {step.render && (
            <Box>
              {step.render(
                { onSuccess: this.handleSuccess, onFail: this.handleFail, onRetry },
                data,
              )}
            </Box>
          )}
          {isError && error && <ErrorDescContainer error={error} onRetry={onRetry} mt={2} />}
        </Box>

        {isError && <ErrorContainer />}

        <SuccessContainer isVisible={isSuccess} />
        <SpinnerContainer isVisible={status === 'running'} isPassed={isPassed} isError={isError} />
      </DeviceInteractionStepContainer>
    )
  }
}

export default DeviceInteractionStep
