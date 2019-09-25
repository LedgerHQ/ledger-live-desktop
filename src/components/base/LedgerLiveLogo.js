// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

type Props = {
  icon: any,
}
class LedgerLiveLogo extends PureComponent<Props> {
  render() {
    const { icon, ...p } = this.props
    return <LiveLogoContainer {...p}>{icon}</LiveLogoContainer>
  }
}

const LiveLogoContainer = styled(Box).attrs(() => ({
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
}))`
  background-color: ${p => p.theme.colors.palette.primary.contrastText};
  box-shadow: 0 2px 24px 0 #00000014;
  width: ${p => (p.width ? p.width : '80px')};
  height: ${p => (p.height ? p.height : '80px')};
`

export default LedgerLiveLogo
