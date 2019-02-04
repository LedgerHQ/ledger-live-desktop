// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import shuffle from 'lodash/shuffle'

import type { T } from 'types/common'
import { urls } from 'config/urls'
import { i } from 'helpers/staticPath'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import ExchangeCard from './ExchangeCard'

import CoinhouseLogo from './logos/coinhouse'
import ChangellyLogo from './logos/changelly'
import CoinmamaLogo from './logos/bigmama'
import SimplexLogo from './logos/simplex'
import PaybisLogo from './logos/paybis'
import Coinberry from './logos/coinberry'
import BtcDirect from './logos/btcdirect'

type Props = {
  t: T,
}

const cards = shuffle([
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
  {
    key: 'luno',
    id: 'luno',
    url: urls.luno,
    logo: <img src={i('logos/exchanges/luno.svg')} alt="Luno" width={150} />,
  },
  {
    key: 'shapeshift',
    id: 'shapeshift',
    url: urls.shapeshift,
    logo: <img src={i('logos/exchanges/shapeshift.svg')} alt="Shapeshift" width={150} />,
  },
  {
    key: 'genesis',
    id: 'genesis',
    url: urls.genesis,
    logo: <img src={i('logos/exchanges/genesis.svg')} alt="Genesis" width={150} />,
  },
  {
    key: 'kyberSwap',
    id: 'kyberSwap',
    url: urls.kyberSwap,
    logo: <img src={i('logos/exchanges/kyber-swap.png')} alt="KyberSwap" width={150} />,
  },
  {
    key: 'changeNow',
    id: 'changeNow',
    url: urls.changeNow,
    logo: <img src={i('logos/exchanges/change-now.png')} alt="ChangeNow" width={150} />,
  },
  {
    key: 'thorSwap',
    id: 'thorSwap',
    url: urls.thorSwap,
    logo: <img src={i('logos/exchanges/thor-swap.png')} alt="ThorSwap" width={150} />,
  },
  {
    key: 'coinberry',
    id: 'coinberry',
    url: urls.coinberry,
    logo: <Coinberry width={150} />,
  },
  {
    key: 'btcDirect',
    id: 'btcDirect',
    url: urls.btcDirect,
    logo: <BtcDirect width={150} />,
  },
])

class ExchangePage extends PureComponent<Props> {
  render() {
    const { t } = this.props
    return (
      <Box pb={6} selectable>
        <TrackPage category="Exchange" />
        <Box ff="Museo Sans|Regular" fontSize={7} color="dark">
          {t('exchange.title')}
        </Box>
        <Box ff="Museo Sans|Light" fontSize={5} mb={5}>
          {t('exchange.desc')}
        </Box>
        <Box flow={3}>{cards.map(card => <ExchangeCard key={card.key} t={t} card={card} />)}</Box>
      </Box>
    )
  }
}

export default translate()(ExchangePage)
