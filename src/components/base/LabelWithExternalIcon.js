// @flow

import React from 'react'
import styled from 'styled-components'

import Label from 'components/base/Label'
import Box from 'components/base/Box'
import IconExternalLink from 'icons/ExternalLink'

const LabelWrapper = styled(Label).attrs({ ff: p => (p.ff ? p.ff : 'Museo Sans|Bold') })`
  display: inline-flex;
  color: ${p => p.theme.colors[p.color] || 'auto'};
  &:hover {
    color: ${p => p.theme.colors.wallet};
    cursor: pointer;
  }
`

type Props = { onClick: ?() => void, label: string, color?: string, ff?: string }

// can add more dynamic options if needed
export function LabelWithExternalIcon({ onClick, label, color, ff }: Props) {
  return (
    <LabelWrapper onClick={onClick} color={color} ff={ff}>
      <span>{label}</span>
      <Box ml={1}>
        <IconExternalLink size={12} />
      </Box>
    </LabelWrapper>
  )
}

export default LabelWithExternalIcon
