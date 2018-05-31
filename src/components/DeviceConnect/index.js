// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Trans, translate } from 'react-i18next'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

import type { T, Device } from 'types/common'

import noop from 'lodash/noop'

import Box from 'components/base/Box'
import Spinner from 'components/base/Spinner'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'

import IconCheck from 'icons/Check'
import IconExclamationCircle from 'icons/ExclamationCircle'
import IconInfoCircle from 'icons/InfoCircle'
import IconUsb from 'icons/Usb'
import IconHome from 'icons/Home'

import * as IconDevice from 'icons/device'

const Step = styled(Box).attrs({
  borderRadius: 1,
  justifyContent: 'center',
  fontSize: 4,
})`
  border: 1px solid
    ${p =>
      p.validated
        ? p.theme.colors.wallet
        : p.hasErrors
          ? p.theme.colors.alertRed
          : p.theme.colors.fog};
`

const StepIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  width: 64px;
`

const StepContent = styled(Box).attrs({
  color: 'dark',
  horizontal: true,
  alignItems: 'center',
})`
  height: 60px;
  line-height: 1.2;

  strong {
    font-weight: 600;
  }
`

const ListDevices = styled(Box).attrs({
  p: 3,
  pt: 1,
  flow: 2,
})``

const DeviceItem = styled(Box).attrs({
  bg: 'lightGrey',
  borderRadius: 1,
  alignItems: 'center',
  color: 'dark',
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  horizontal: true,
  pr: 3,
  pl: 0,
})`
  cursor: pointer;
  height: 54px;
`
const DeviceIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'graphite',
})`
  width: 55px;
`
const DeviceSelected = styled(Box).attrs({
  alignItems: 'center',
  bg: p => (p.selected ? 'wallet' : 'white'),
  color: 'white',
  justifyContent: 'center',
})`
  border-radius: 50%;
  border: 1px solid ${p => (p.selected ? p.theme.colors.wallet : p.theme.colors.fog)};
  height: 18px;
  width: 18px;
`

const WrapperIconCurrency = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  border: 1px solid ${p => p.theme.colors[p.color]};
  border-radius: 8px;
  height: 24px;
  width: 24px;
`

const Info = styled(Box).attrs({
  alignItems: 'center',
  color: p => (p.hasErrors ? 'alertRed' : 'grey'),
  flow: 2,
  fontSize: 3,
  horizontal: true,
  ml: 1,
})`
  strong {
    font-weight: 600;
  }
`

const StepCheck = ({ checked, hasErrors }: { checked: boolean, hasErrors?: boolean }) => (
  <Box pr={5}>
    {checked ? (
      <Box color="wallet">
        <IconCheck size={16} />
      </Box>
    ) : hasErrors ? (
      <Box color="alertRed">
        <IconExclamationCircle size={16} />
      </Box>
    ) : (
      <Spinner size={16} />
    )}
  </Box>
)

StepCheck.defaultProps = {
  hasErrors: false,
}

type Props = {
  accountName: null | string,
  appOpened: null | 'success' | 'fail',
  genuineCheckStatus: null | 'success' | 'fail',
  withGenuineCheck: boolean,
  currency: CryptoCurrency,
  devices: Device[],
  deviceSelected: ?Device,
  onChangeDevice: Device => void,
  t: T,
  errorMessage: ?string,
}

const emitChangeDevice = props => {
  const { onChangeDevice, deviceSelected, devices } = props

  if (deviceSelected === null && devices.length > 0) {
    onChangeDevice(devices[0])
  }
}

class DeviceConnect extends PureComponent<Props> {
  static defaultProps = {
    accountName: null,
    appOpened: null,
    devices: [],
    deviceSelected: null,
    onChangeDevice: noop,
    withGenuineCheck: false,
  }

  componentDidMount() {
    emitChangeDevice(this.props)
  }

  componentWillReceiveProps(nextProps) {
    emitChangeDevice(nextProps)
  }

  getStepState = stepStatus => ({
    success: stepStatus === 'success',
    fail: stepStatus === 'fail',
  })

  render() {
    const {
      deviceSelected,
      genuineCheckStatus,
      withGenuineCheck,
      appOpened,
      errorMessage,
      accountName,
      currency,
      t,
      onChangeDevice,
      devices,
    } = this.props

    const appState = this.getStepState(appOpened)
    const genuineCheckState = this.getStepState(genuineCheckStatus)

    const hasDevice = devices.length > 0
    const hasMultipleDevices = devices.length > 1

    return (
      <Box flow={4}>
        <Step validated={hasDevice}>
          <StepContent>
            <StepIcon>
              <IconUsb size={36} />
            </StepIcon>
            <Box grow shrink>
              <Trans i18nKey="deviceConnect:step1.connect" parent="div">
                {'Connect your '}
                <strong>Ledger device</strong>
                {' to your computer and enter your '}
                <strong>PIN code</strong>
                {' on your device'}
              </Trans>
            </Box>
            <StepCheck checked={hasDevice} />
          </StepContent>
          {hasMultipleDevices && (
            <ListDevices>
              <Box color="graphite" fontSize={3}>
                {t('deviceConnect:step1.choose', { count: devices.length })}
              </Box>
              <Box flow={2}>
                {devices.map(d => {
                  const Icon = IconDevice[d.product.replace(/\s/g, '')]
                  return (
                    <DeviceItem key={d.path} onClick={() => onChangeDevice(d)}>
                      <DeviceIcon>
                        <Icon size={28} />
                      </DeviceIcon>
                      <Box grow noShrink>
                        {`${d.manufacturer} ${d.product}`}
                      </Box>
                      <Box>
                        <DeviceSelected selected={d === deviceSelected}>
                          <IconCheck size={10} />
                        </DeviceSelected>
                      </Box>
                    </DeviceItem>
                  )
                })}
              </Box>
            </ListDevices>
          )}
        </Step>

        <Step validated={appState.success} hasErrors={appState.fail}>
          {currency ? (
            <StepContent>
              <StepIcon>
                <WrapperIconCurrency>
                  <CryptoCurrencyIcon currency={currency} size={12} />
                </WrapperIconCurrency>
              </StepIcon>
              <Box grow shrink>
                <Trans i18nKey="deviceConnect:step2.open" parent="div">
                  {'Open '}
                  <strong>{currency.name}</strong>
                  {' App on your device'}
                </Trans>
              </Box>
              <StepCheck checked={appState.success} hasErrors={appState.fail} />
            </StepContent>
          ) : (
            <StepContent>
              <StepIcon>
                <WrapperIconCurrency>
                  <IconHome size={12} />
                </WrapperIconCurrency>
              </StepIcon>
              <Box grow shrink>
                <Trans i18nKey="deviceConnect:dashboard.open" parent="div">
                  {'Go to the '}
                  <strong>{'dashboard'}</strong>
                  {' on your device'}
                </Trans>
              </Box>
              <StepCheck checked={appState.success} hasErrors={appState.fail} />
            </StepContent>
          )}
        </Step>

        {/*                      GENUINE CHECK                               */}
        {/*                      -------------                               */}

        {withGenuineCheck && (
          <Step validated={genuineCheckState.success} hasErrors={genuineCheckState.fail}>
            <StepContent>
              <StepIcon>
                <WrapperIconCurrency>
                  <IconCheck size={12} />
                </WrapperIconCurrency>
              </StepIcon>
              <Box grow shrink>
                <Trans i18nKey="deviceConnect:stepGenuine.open" parent="div">
                  {'Confirm '}
                  <strong>{'authentication'}</strong>
                  {' on your device'}
                </Trans>
              </Box>
              <StepCheck checked={genuineCheckState.success} hasErrors={genuineCheckState.fail} />
            </StepContent>
          </Step>
        )}

        {appState.fail ? (
          <Info hasErrors>
            <IconInfoCircle size={12} />
            <Box shrink selectable>
              {accountName ? (
                <Trans i18nKey="deviceConnect:info" parent="div">
                  {'You must use the device associated to the account '}
                  <strong>{accountName}</strong>
                </Trans>
              ) : (
                String(errorMessage || '')
              )}
            </Box>
          </Info>
        ) : null}
      </Box>
    )
  }
}

export default translate()(DeviceConnect)
