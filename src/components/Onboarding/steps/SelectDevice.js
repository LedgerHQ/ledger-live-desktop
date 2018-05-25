// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { isLedgerNano } from 'reducers/onboarding'

import Box from 'components/base/Box'
import IconCheckCirle from 'icons/CheckCircle'
import IconLedgerNano from 'icons/onboarding/LedgerNano'
import IconLedgerBlue from 'icons/onboarding/LedgerBlue'
import { Title, Description, Inner } from '../helperComponents'

import type { StepProps } from '..'

const mapDispatchToProps = { isLedgerNano }

class SelectDevice extends PureComponent<StepProps, {}> {
  handleIsLedgerNano = (isLedgerNano: boolean) => {
    this.props.isLedgerNano(isLedgerNano)
    this.props.nextStep()
  }
  render() {
    const { t, onboarding } = this.props

    return (
      <Box sticky pt={150}>
        <Box grow alignItems="center">
          <Title>{t('onboarding:selectDevice.title')}</Title>
          <Description>{t('onboarding:selectDevice.desc')}</Description>
          <Box>
            <Inner>
              <DeviceContainer
                onClick={() => this.handleIsLedgerNano(true)}
                style={{
                  position: 'relative',
                }}
              >
                {onboarding.isLedgerNano && <DeviceSelected />}
                <DeviceIcon>
                  <IconLedgerNano />
                </DeviceIcon>
                <BlockTitle pb={3}>{t('onboarding:selectDevice.ledgerNanoCard.title')}</BlockTitle>
              </DeviceContainer>
              <DeviceContainer
                onClick={() => this.handleIsLedgerNano(false)}
                style={{
                  position: 'relative',
                }}
              >
                {!onboarding.isLedgerNano && <DeviceSelected />}
                <DeviceIcon>
                  <IconLedgerBlue />
                </DeviceIcon>
                <BlockTitle pb={3}>{t('onboarding:selectDevice.ledgerBlueCard.title')}</BlockTitle>
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
  position: 'relative',
})`
  width: 218px;
  height: 204px;
  border: ${props => `1px solid ${props.theme.colors.fog}`};
  &:hover,
  &:focus {
    opacity: 0.5;
    cursor: pointer;
  }
`
const DeviceIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'graphite',
})`
  width: 55px;
  min-height: 80px;
`
export const BlockDescription = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'center',
  color: 'grey',
})``
export const BlockTitle = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  textAlign: 'center',
})``
export function DeviceSelected() {
  return (
    <Box
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
      }}
    >
      <IconCheckCirle size={12} />
    </Box>
  )
}
