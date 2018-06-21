// @flow
/* eslint-disable react/jsx-no-literals */

import React from 'react'
import { Trans, translate } from 'react-i18next'
import styled from 'styled-components'
import isNull from 'lodash/isNull'
import type { Device } from 'types/common'

import Box from 'components/base/Box'
import Spinner from 'components/base/Spinner'

import IconCheck from 'icons/Check'
import IconExclamationCircle from 'icons/ExclamationCircle'
import IconUsb from 'icons/Usb'
import IconHome from 'icons/Home'

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

const WrapperIconCurrency = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  border: 1px solid ${p => p.theme.colors[p.color]};
  border-radius: 8px;
  height: 24px;
  width: 24px;
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
  // t: T,
  device: ?Device,
  deviceInfo: ?DeviceInfo,
  errors: {
    dashboardError: ?Error,
    genuineError: ?Error,
  },
  isGenuine: boolean,
}

const WorkflowDefault = ({ device, deviceInfo, errors, isGenuine }: Props) => (
  <Box flow={4} ff="Open Sans">
    <Step validated={!!device}>
      <StepContent>
        <StepIcon>
          <IconUsb size={36} />
        </StepIcon>
        <Box grow shrink>
          <Trans i18nKey="app:deviceConnect.step1.connect" parent="div">
            Connect and unlock your <strong>Ledger device</strong> <strong />
          </Trans>
        </Box>
        <StepCheck checked={!!device} />
      </StepContent>
    </Step>

    <Step validated={!!device && !!deviceInfo} hasErrors={!!device && !!errors.dashboardError}>
      <StepContent>
        <StepIcon>
          <WrapperIconCurrency>
            <IconHome size={12} />
          </WrapperIconCurrency>
        </StepIcon>
        <Box grow shrink>
          <Trans i18nKey="deviceConnect:dashboard.open" parent="div">
            {'Navigate to the '}
            <strong>{'dashboard'}</strong>
            {' on your device'}
          </Trans>
        </Box>
        <StepCheck
          checked={!!device && !!deviceInfo}
          hasErrors={!!device && !!errors.dashboardError}
        />
      </StepContent>
    </Step>

    {/*                      GENUINE CHECK                               */}
    {/*                      -------------                               */}

    <Step
      validated={(!!device && !isNull(isGenuine) && isGenuine && !errors.genuineError) || undefined}
      hasErrors={(!!device && !isNull(isGenuine) && !isGenuine) || errors.genuineError || undefined}
    >
      <StepContent>
        <StepIcon>
          <WrapperIconCurrency>
            <IconCheck size={12} />
          </WrapperIconCurrency>
        </StepIcon>
        <Box grow shrink>
          <Trans i18nKey="deviceConnect:stepGenuine.open" parent="div">
            {'Allow the '}
            <strong>{'Ledger Manager'}</strong>
            {' on your device'}
          </Trans>
        </Box>
        <StepCheck
          checked={!!device && !isNull(isGenuine) && isGenuine}
          hasErrors={(!!device && !isNull(isGenuine) && !isGenuine) || undefined}
        />
      </StepContent>
    </Step>
  </Box>
)

export default translate()(WorkflowDefault)
