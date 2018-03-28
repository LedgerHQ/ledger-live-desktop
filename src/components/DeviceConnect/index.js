// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Trans, translate } from 'react-i18next'
import { getCurrencyByCoinType } from '@ledgerhq/currencies'
import { getIconByCoinType } from '@ledgerhq/currencies/react'

import type { T, Device, Devices } from 'types/common'

import noop from 'lodash/noop'

import Box from 'components/base/Box'

import IconCheck from 'icons/Check'
import IconExclamationCircle from 'icons/ExclamationCircle'
import IconInfoCircle from 'icons/InfoCircle'
import IconLoader from 'icons/Loader'
import IconUsb from 'icons/Usb'

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
        : p.hasErrors ? p.theme.colors.alertRed : p.theme.colors.fog};
`
const StepIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  width: 64px;
`
const StepContent = styled(Box).attrs({
  horizontal: true,
  alignItems: 'center',
})`
  height: 60px;

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
  pt: 1,
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
      <IconLoader size={16} />
    )}
  </Box>
)

StepCheck.defaultProps = {
  hasErrors: false,
}

type Props = {
  accountName: null | string,
  appOpened: null | 'success' | 'fail',
  coinType: number,
  devices: Devices,
  deviceSelected: Device | null,
  onChangeDevice: Function,
  t: T,
}

class DeviceConnect extends PureComponent<Props> {
  static defaultProps = {
    accountName: null,
    appOpened: null,
    devices: [],
    deviceSelected: null,
    onChangeDevice: noop,
  }

  getDeviceSelected() {
    const { deviceSelected, devices } = this.props

    return deviceSelected || (devices.length === 1 && devices[0]) || null
  }

  getAppState() {
    const { appOpened } = this.props

    return {
      success: appOpened === 'success',
      fail: appOpened === 'fail',
    }
  }

  render() {
    const { accountName, coinType, t, onChangeDevice, devices } = this.props

    const deviceSelected = this.getDeviceSelected()
    const appState = this.getAppState()

    const hasDevice = devices.length > 0
    const hasMultipleDevices = devices.length > 1

    const { name: appName } = getCurrencyByCoinType(coinType)
    const IconCurrency = getIconByCoinType(coinType)
    console.log('devices', devices)
    console.log('deviceSelected', deviceSelected)
    return (
      <Box flow={4}>
        <Step validated={hasDevice}>
          <StepContent>
            <StepIcon>
              <IconUsb size={36} />
            </StepIcon>
            <Box grow shrink>
              <Trans i18nKey="deviceConnect:step1.connect" parent="div">
                Connect your <strong>Ledger device</strong> to your computer and enter your{' '}
                <strong>PIN code</strong> on your device
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
                    <DeviceItem
                      key={`${d.vendorId}-${d.productId}`}
                      onClick={() => onChangeDevice(d)}
                    >
                      <DeviceIcon>
                        <Icon size={28} />
                      </DeviceIcon>
                      <Box grow>
                        {d.manufacturer} {d.product}
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
          <StepContent>
            <StepIcon>
              <WrapperIconCurrency>
                <IconCurrency size={12} />
              </WrapperIconCurrency>
            </StepIcon>
            <Box grow shrink>
              <Trans i18nKey="deviceConnect:step2.open" parent="div">
                {/* $FlowFixMe */}
                Open <strong>{{ appName }} App</strong> on your device
              </Trans>
            </Box>
            <StepCheck checked={appState.success} hasErrors={appState.fail} />
          </StepContent>
        </Step>
        {accountName !== null && (
          <Info hasErrors={appState.fail}>
            <Box>
              <IconInfoCircle size={12} />
            </Box>
            <Box>
              <Trans i18nKey="deviceConnect:info" parent="div">
                {/* $FlowFixMe */}
                You must use the device associated to the account <strong>{{ accountName }}</strong>
              </Trans>
            </Box>
          </Info>
        )}
      </Box>
    )
  }
}

export default translate()(DeviceConnect)
