// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import ExchangeCard from './ExchangeCard'

import CoinhouseLogo from './logos/coinhouse'
import ChangellyLogo from './logos/changelly'
import CoinmamaLogo from './logos/bigmama'

type Props = {
  t: T,
}

const cards = [
  {
    key: 'coinhouse',
    id: 'coinhouse',
    url: 'https://www.coinhouse.com/r/157530',
    logo: <CoinhouseLogo width={150} />,
  },
  {
    key: 'changelly',
    id: 'changelly',
    url: 'https://changelly.com/?ref_id=aac789605a01',
    logo: <ChangellyLogo width={150} />,
  },
  {
    key: 'coinmama',
    id: 'coinmama',
    url: 'http://go.coinmama.com/visit/?bta=51801&nci=5343',
    logo: <CoinmamaLogo width={150} />,
  },
]

class ExchangePage extends PureComponent<Props> {
  render() {
    const { t } = this.props
    return (
      <Box pb={6}>
        <TrackPage category="Exchange" />
        <Box ff="Museo Sans|Regular" fontSize={7} color="dark">
          {t('app:exchange.title')}
        </Box>
        <Box ff="Museo Sans|Light" fontSize={5} mb={5}>
          {t('app:exchange.desc')}
        </Box>
        <Box flow={3}>{cards.map(card => <ExchangeCard key={card.key} t={t} card={card} />)}</Box>
      </Box>
    )
  }
}

export default translate()(ExchangePage)
