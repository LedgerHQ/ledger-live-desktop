// @flow

import React from 'react'
import styled from 'styled-components'

import { rgba } from 'styles/helpers'

import Box, { Card } from 'components/base/Box'

export const SettingsSection = styled(Card).attrs(() => ({ p: 0 }))``

export const SettingsSectionHeaderContainer = styled(Box).attrs(() => ({
  p: 4,
  horizontal: true,
  align: 'center',
}))`
  line-height: normal;
`

const RoundIconContainer = styled(Box).attrs(p => ({
  align: 'center',
  justify: 'center',
  bg: rgba(p.theme.colors.wallet, 0.2),
  color: 'wallet',
}))`
  height: 34px;
  width: 34px;
  border-radius: 50%;
`

export const SettingsSectionBody = styled(Box)`
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  > * + * {
    &:after {
      background: ${p => p.theme.colors.palette.divider};
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
  onClick,
  style,
}: {
  title: string,
  desc: string,
  icon: any,
  renderRight?: any,
  onClick?: () => void,
  style?: any,
}) {
  return (
    <SettingsSectionHeaderContainer tabIndex={-1} onClick={onClick} style={style}>
      <RoundIconContainer mr={3}>{icon}</RoundIconContainer>
      <Box grow flex={1} mr={3}>
        <Box ff="Inter|Medium" color="palette.text.shade100" data-e2e="settingsSection_title">
          {title}
        </Box>
        <Box ff="Inter" fontSize={3} mt={1}>
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

export const SettingsSectionRowContainer = styled(Box).attrs(() => ({
  p: 4,
  horizontal: true,
  align: 'center',
  relative: true,
  justifyContent: 'space-between',
}))``

export function SettingsSectionRow({
  title,
  desc,
  children,
  onClick,
}: {
  title?: string,
  desc: string,
  children?: any,
  onClick?: ?Function,
}) {
  return (
    <SettingsSectionRowContainer onClick={onClick} tabIndex={-1}>
      <Box grow shrink style={{ marginRight: '10%' }}>
        {title && (
          <Box ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
            {title}
          </Box>
        )}
        <Box
          ff="Inter"
          fontSize={3}
          color="palette.text.shade60"
          mt={1}
          mr={1}
          style={{ maxWidth: 520 }}
        >
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
