// @flow

import React from 'react'
import styled from 'styled-components'

import Label from 'components/base/Label'
import Box from 'components/base/Box'
import IconExternalLink from 'icons/ExternalLink'

const LabelWrapper = styled(Label).attrs({})`
  &:hover {
    color: ${p => p.theme.colors.wallet};
    cursor: pointer;
  }
`

type Props = { onClick: ?() => void, label: string }

// can add more dynamic options if needed
export function LabelWithExternalIcon({ onClick, label }: Props) {
  return (
    <LabelWrapper onClick={onClick}>
      <span>{label}</span>
      <Box ml={1}>
        <IconExternalLink size={12} />
      </Box>
    </LabelWrapper>
  )
}

export default LabelWithExternalIcon
