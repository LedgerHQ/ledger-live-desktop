// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'
import { urls } from 'config/urls'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import ExchangeCard from './ExchangeCard'

import CoinhouseLogo from './logos/coinhouse'
import ChangellyLogo from './logos/changelly'
import CoinmamaLogo from './logos/bigmama'
import SimplexLogo from './logos/simplex'
import PaybisLogo from './logos/paybis'

type Props = {
  t: T,
}

const cards = [
  {
    key: 'coinhouse',
    id: 'coinhouse',
    url: urls.coinhouse,
    logo: <CoinhouseLogo width={150} />,
  },
  {
    key: 'changelly',
    id: 'changelly',
    url: urls.changelly,
    logo: <ChangellyLogo width={150} />,
  },
  {
    key: 'coinmama',
    id: 'coinmama',
    url: urls.coinmama,
    logo: <CoinmamaLogo width={150} />,
  },
  {
    key: 'simplex',
    id: 'simplex',
    url: urls.simplex,
    logo: <SimplexLogo width={160} height={57} />,
  },
  {
    key: 'paybis',
    id: 'paybis',
    url: urls.paybis,
    logo: <PaybisLogo width={150} height={57} />,
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
