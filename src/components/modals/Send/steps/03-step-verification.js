// @flow

import invariant from 'invariant'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { multiline } from 'styles/helpers'
import { createCustomErrorClass } from 'helpers/errors'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import WarnBox from 'components/WarnBox'
import DeviceConfirm from 'components/DeviceConfirm'

import type { StepProps } from '../index'

export const UserRefusedOnDevice = createCustomErrorClass('UserRefusedOnDevice')

const Container = styled(Box).attrs({ alignItems: 'center', fontSize: 4, pb: 4 })``
const Info = styled(Box).attrs({ ff: 'Open Sans|SemiBold', color: 'dark', mt: 6, mb: 4, px: 5 })`
  text-align: center;
`

export default class StepVerification extends PureComponent<StepProps<*>> {
  componentDidMount() {
    this.signTransaction()
  }

  componentWillUnmount() {
    this._isUnmounted = true
    if (this._signTransactionSub) {
      this._signTransactionSub.unsubscribe()
    }
  }

  _isUnmounted = false
  _signTransactionSub = null

  signTransaction = async () => {
    const {
      device,
      account,
      transaction,
      bridge,
      onTransactionError,
      transitionTo,
      onOperationBroadcasted,
    } = this.props
    invariant(device && account && transaction && bridge, 'signTransaction invalid conditions')
    this._signTransactionSub = bridge
      .signAndBroadcast(account, transaction, device.path)
      .subscribe({
        next: e => {
          switch (e.type) {
            case 'signed': {
              if (this._isUnmounted) return
              transitionTo('confirmation')
              break
            }
            case 'broadcasted': {
              onOperationBroadcasted(e.operation)
              break
            }
            default:
          }
        },
        error: err => {
          const error = err.statusCode === 0x6985 ? new UserRefusedOnDevice() : err
          onTransactionError(error)
          transitionTo('confirmation')
        },
      })
  }
  render() {
    const { t } = this.props
    return (
      <Container>
        <TrackPage category="Send" name="Step3" />
        <WarnBox>{multiline(t('app:send.steps.verification.warning'))}</WarnBox>
        <Info>{t('app:send.steps.verification.body')}</Info>
        <DeviceConfirm />
      </Container>
    )
  }
}
