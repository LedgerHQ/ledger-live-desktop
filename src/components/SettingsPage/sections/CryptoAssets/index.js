// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import TrackPage from 'analytics/TrackPage'
import { SettingsSection as Section } from '../../SettingsSection'
import Currencies from './Currencies'
import Rates from './Rates'

const Wrapper = styled.div`
  > ${Section} {
    &:first-of-type {
      margin-bottom: 16px;
    }
  }
`

class TabCryptoAssets extends PureComponent<{}> {
  render() {
    return (
      <Wrapper>
        <TrackPage category="Settings" name="Currencies" />
        <Currencies />
        <Rates />
      </Wrapper>
    )
  }
}

export default TabCryptoAssets
