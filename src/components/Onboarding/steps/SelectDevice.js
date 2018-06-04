// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { rgba } from 'styles/helpers'

import { isLedgerNano } from 'reducers/onboarding'

import Box from 'components/base/Box'
import IconCheckCirle from 'icons/Check'
import IconLedgerNano from 'icons/illustrations/LedgerNano'
import IconLedgerBlue from 'icons/illustrations/LedgerBlue'
import { Title, Inner } from '../helperComponents'

import type { StepProps } from '..'

const mapDispatchToProps = { isLedgerNano }

class SelectDevice extends PureComponent<StepProps, {}> {
  handleIsLedgerNano = (isLedgerNano: boolean) => {
    this.props.isLedgerNano(isLedgerNano)
    this.props.onboarding.flowType === 'initializedDevice'
      ? this.props.jumpStep('genuineCheck')
      : this.props.nextStep()
  }
  render() {
    const { t, onboarding } = this.props

    return (
      <Box sticky pt={200}>
        <Box grow alignItems="center">
          <Title>{t('onboarding:selectDevice.title')}</Title>
          <Box mt={7}>
            <Inner>
              <DeviceContainer
                isActive={onboarding.isLedgerNano}
                onClick={() => this.handleIsLedgerNano(true)}
              >
                {onboarding.isLedgerNano && <DeviceSelected />}
                <DeviceIcon>
                  <IconLedgerNano />
                </DeviceIcon>
                <BlockTitle>{t('onboarding:selectDevice.ledgerNanoCard.title')}</BlockTitle>
              </DeviceContainer>
              <DeviceContainer
                isActive={!onboarding.isLedgerNano}
                onClick={() => this.handleIsLedgerNano(false)}
              >
                {!onboarding.isLedgerNano && <DeviceSelected />}
                <DeviceIcon>
                  <IconLedgerBlue />
                </DeviceIcon>
                <BlockTitle>{t('onboarding:selectDevice.ledgerBlueCard.title')}</BlockTitle>
              </DeviceContainer>
            </Inner>
          </Box>
        </Box>
      </Box>
    )
  }
}

export default connect(null, mapDispatchToProps)(SelectDevice)

const DeviceContainer = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  relative: true,
})`
  width: 218px;
  height: 204px;
  border: ${props => `1px solid ${props.theme.colors[props.isActive ? 'wallet' : 'fog']}`};
  &:hover {
    cursor: pointer;
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }
`
const DeviceIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  width: 55px;
  height: 80px;
`

export const BlockTitle = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  textAlign: 'center',
  pt: 3,
})``
export function DeviceSelected() {
  return (
    <SelectDeviceIconWrapper
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
      }}
    >
      <IconCheckCirle size={10} />
    </SelectDeviceIconWrapper>
  )
}

const SelectDeviceIconWrapper = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  bg: 'wallet',
})`
  border-radius: 50%;
  width: 18px;
  height: 18px;
`
