// @flow

import React from 'react'
import styled from 'styled-components'

import { rgba } from 'styles/helpers'

import Box, { Card } from 'components/base/Box'

export const SettingsSection = styled(Card).attrs({ p: 0 })``

const SettingsSectionHeaderContainer = styled(Box).attrs({
  p: 4,
  horizontal: true,
  align: 'center',
})`
  border-bottom: 1px solid ${p => p.theme.colors.lightFog};
  line-height: normal;
`

const RoundIconContainer = styled(Box).attrs({
  align: 'center',
  justify: 'center',
  bg: p => rgba(p.theme.colors.wallet, 0.2),
  color: 'wallet',
})`
  height: 30px;
  width: 30px;
  border-radius: 50%;
`

export const SettingsSectionBody = styled(Box)`
  > * + * {
    &:after {
      background: ${p => p.theme.colors.lightFog};
      content: '';
      display: block;
      height: 1px;
      left: ${p => p.theme.space[4]}px;
      position: absolute;
      right: ${p => p.theme.space[4]}px;
      top: 0;
    }
  }
`

export function SettingsSectionHeader({
  title,
  desc,
  icon,
  renderRight,
}: {
  title: string,
  desc: string,
  icon: any,
  renderRight?: any,
}) {
  return (
    <SettingsSectionHeaderContainer>
      <RoundIconContainer mr={3}>{icon}</RoundIconContainer>
      <Box grow>
        <Box ff="Museo Sans|Regular" color="dark">
          {title}
        </Box>
        <Box ff="Open Sans" fontSize={3}>
          {desc}
        </Box>
      </Box>
      {renderRight && (
        <Box alignItems="center" justifyContent="flex-end">
          {renderRight}
        </Box>
      )}
    </SettingsSectionHeaderContainer>
  )
}

SettingsSectionHeader.defaultProps = {
  renderRight: undefined,
}

const SettingsSectionRowContainer = styled(Box).attrs({
  p: 4,
  horizontal: true,
  align: 'center',
  relative: true,
})`
  cursor: ${p => (p.onClick ? 'pointer' : '')};
`

export function SettingsSectionRow({
  title,
  desc,
  children,
  onClick,
}: {
  title: string,
  desc: string,
  children?: any,
  onClick?: ?Function,
}) {
  return (
    <SettingsSectionRowContainer onClick={onClick}>
      <Box grow>
        <Box ff="Open Sans|SemiBold" color="dark" fontSize={4}>
          {title}
        </Box>
        <Box ff="Open Sans" fontSize={3} color="grey">
          {desc}
        </Box>
      </Box>
      <Box>{children}</Box>
    </SettingsSectionRowContainer>
  )
}

SettingsSectionRow.defaultProps = {
  children: null,
  onClick: null,
}
