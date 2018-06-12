// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Trans, translate } from 'react-i18next'
import isNull from 'lodash/isNull'

import type { Node } from 'react'
import type { Device, T } from 'types/common'

import { i } from 'helpers/staticPath'
import Box from 'components/base/Box'
import Space from 'components/base/Space'
import Spinner from 'components/base/Spinner'
import Text from 'components/base/Text'

import IconCheck from 'icons/Check'
import IconExclamationCircle from 'icons/ExclamationCircle'
import IconUsb from 'icons/Usb'
import IconHome from 'icons/Home'

import EnsureDevice from './EnsureDevice'
import EnsureDashboard from './EnsureDashboard'
import EnsureGenuine from './EnsureGenuine'

type DeviceInfo = {
  targetId: number | string,
  version: string,
  final: boolean,
  mcu: boolean,
}

type Error = {
  message: string,
  stack: string,
}

type Props = {
  t: T,
  renderMcuUpdate: (deviceInfo: DeviceInfo) => Node,
  renderFinalUpdate: (deviceInfo: DeviceInfo) => Node,
  renderDashboard: (device: Device, deviceInfo: DeviceInfo) => Node,
  renderError: (dashboardError: ?Error, genuineError: ?Error) => Node,
}
type State = {}

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

const StepCheck = ({ checked, hasErrors }: { checked: ?boolean, hasErrors?: boolean }) => (
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

const WrapperIconCurrency = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  border: 1px solid ${p => p.theme.colors[p.color]};
  border-radius: 8px;
  height: 24px;
  width: 24px;
`

class Workflow extends PureComponent<Props, State> {
  render() {
    const { renderDashboard, renderFinalUpdate, renderMcuUpdate, renderError, t } = this.props
    return (
      <EnsureDevice>
        {(device: Device) => (
          <EnsureDashboard device={device}>
            {(deviceInfo: ?DeviceInfo, dashboardError: ?Error) => (
              <EnsureGenuine device={device}>
                {(isGenuine: ?boolean, genuineError: ?Error) => {
                  if (dashboardError || genuineError) {
                    return renderError ? (
                      renderError(dashboardError, genuineError)
                    ) : (
                      <div>
                        {dashboardError && <span>{dashboardError.message}</span>}
                        {genuineError && <span>{genuineError.message}</span>}
                      </div>
                    )
                  }

                  if (deviceInfo && deviceInfo.mcu) {
                    return renderMcuUpdate(deviceInfo)
                  }

                  if (deviceInfo && deviceInfo.final) {
                    return renderFinalUpdate(deviceInfo)
                  }

                  if (isGenuine && deviceInfo && device && !dashboardError && !genuineError) {
                    return renderDashboard(device, deviceInfo)
                  }

                  return (
                    <Box align="center">
                      <Space of={152} />
                      <Box align="center" style={{ maxWidth: 460, padding: '0 10px' }}>
                        <img
                          src={i('logos/connectDevice.png')}
                          alt="connect your device"
                          style={{ marginBottom: 30, maxWidth: 362, width: '100%' }}
                        />
                        <Text
                          ff="Museo Sans|Regular"
                          fontSize={7}
                          color="black"
                          style={{ marginBottom: 10 }}
                        >
                          {t('app:manager.plugYourDevice:title')}
                        </Text>
                        <Text ff="Museo Sans|Light" fontSize={5} color="grey" align="center">
                          {t('app:manager.plugYourDevice:desc')}
                        </Text>
                      </Box>
                      <Box flow={4} style={{ maxWidth: 460, padding: '60px 10px 0' }}>
                        {/* DEVICE CHECK */}
                        <Step validated={!!device}>
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
                            <StepCheck checked={!!device} />
                          </StepContent>
                        </Step>

                        {/* DASHBOARD CHECK */}
                        <Step
                          validated={!!device && !!deviceInfo}
                          hasErrors={!!device && !!dashboardError}
                        >
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
                            <StepCheck
                              checked={!!device && !!deviceInfo}
                              hasErrors={!!device && !!dashboardError}
                            />
                          </StepContent>
                        </Step>

                        {/* GENUINE CHECK */}
                        <Step
                          validated={(!!device && !isNull(isGenuine) && isGenuine) || undefined}
                          hasErrors={(!!device && !isNull(isGenuine) && !isGenuine) || undefined}
                        >
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
                            <StepCheck
                              checked={(!!device && !isNull(isGenuine) && isGenuine) || undefined}
                              hasErrors={
                                (!!device && !isNull(isGenuine) && !isGenuine) || undefined
                              }
                            />
                          </StepContent>
                        </Step>
                      </Box>
                    </Box>
                  )
                }}
              </EnsureGenuine>
            )}
          </EnsureDashboard>
        )}
      </EnsureDevice>
    )
  }
}

export default translate()(Workflow)
