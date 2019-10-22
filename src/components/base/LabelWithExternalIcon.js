// @flow

import React from 'react'
import styled from 'styled-components'

import Label from 'components/base/Label'
import Box from 'components/base/Box'
import IconExternalLink from 'icons/ExternalLink'

const LabelWrapper = styled(Label).attrs(p => ({ ff: p.ff ? p.ff : 'Inter|Bold' }))`
  display: inline-flex;
  color: ${p => p.theme.colors[p.color] || 'inherit'};
  &:hover {
    color: ${p => p.theme.colors.wallet};
    cursor: pointer;
  }
`

type Props = {
  onClick: ?() => void,
  label: string,
  color?: string,
  ff?: string,
  iconFirst?: boolean,
}

// can add more dynamic options if needed
export function LabelWithExternalIcon({ onClick, label, color, ff, iconFirst = false }: Props) {
  return (
    <LabelWrapper onClick={onClick} color={color} ff={ff}>
      {iconFirst ? (
        <>
          <Box mr={1}>
            <IconExternalLink size={12} />
          </Box>
          <span>{label}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <Box ml={1}>
            <IconExternalLink size={12} />
          </Box>
        </>
      )}
    </LabelWrapper>
  )
}

export default LabelWithExternalIcon
