// @flow

import React from 'react'
import styled from 'styled-components'

import Label from 'components/base/Label'
import Box from 'components/base/Box'
import IconExternalLink from 'icons/ExternalLink'

// can add more dynamic options if needed
export function LabelWithExternalIcon({ onClick, label }: { onClick: () => void, label: string }) {
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

const LabelWrapper = styled(Label).attrs({})`
  &:hover {
    color: ${p => p.theme.colors.wallet};
    cursor: pointer;
  }
`
