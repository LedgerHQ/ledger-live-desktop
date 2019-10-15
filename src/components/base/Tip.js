// @flow

import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import Box from './Box'
import InfoCircle from '../../icons/InfoCircle'

const TokenTipsContainer = styled(Box)`
  background: ${p => p.theme.colors.pillActiveBackground};
  color: ${p => p.theme.colors.wallet};
  font-weight: 400;
  padding: 16px;
  line-height: 1.38;
`

export default ({ children }: *) => (
  <TokenTipsContainer mt={4} horizontal alignItems="center">
    <InfoCircle size={16} color={useTheme('colors.palette.primary.main')} />
    <div style={{ flex: 1, marginLeft: 20 }}>{children}</div>
  </TokenTipsContainer>
)
