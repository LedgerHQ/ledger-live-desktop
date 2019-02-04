// @flow

import React from 'react'
import styled from 'styled-components'
import { fontSize, color, alignItems } from 'styled-system'

import Box from 'components/base/Box'

import fontFamily from 'styles/styled/fontFamily'
import { darken } from 'styles/helpers'

const Label = styled.label.attrs({
  fontSize: p => p.fontSize || 3,
  ff: 'Museo Sans|Regular',
  color: 'grey',
  align: 'center',
  display: 'block',
})`
  ${alignItems};
  ${color};
  ${fontSize};
  ${fontFamily};
  display: flex;
`

type InteractiveLabelProps = {
  onClick: ?() => void,
  label: string,
  Icon?: React$ComponentType<*>,
}

const InteractiveLabel = ({ onClick, label, Icon }: InteractiveLabelProps) => (
  <LabelWrapper onClick={onClick}>
    {label}
    {Icon && (
      <Box ml={1}>
        <Icon size={12} />
      </Box>
    )}
  </LabelWrapper>
)

const LabelWrapper = styled(Label).attrs({})`
  &:hover {
    color: ${p => p.theme.colors.wallet};
    cursor: pointer;
  }
  &:active {
    color: ${p => darken(p.theme.colors.wallet, 0.1)};
  }
`

export { Label as default, InteractiveLabel }
