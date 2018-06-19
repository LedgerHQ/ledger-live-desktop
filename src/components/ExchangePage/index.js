// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Box from 'components/base/Box'
import ExchangeCard from './ExchangeCard'

import CoinhouseLogo from './logos/coinhouse'
import ChangellyLogo from './logos/changelly'
import CoinmamaLogo from './logos/bigmama'

type Props = {
  t: T,
}

class ExchangePage extends PureComponent<Props> {
  render() {
    const { t } = this.props
    const cards = [
      {
        key: 'coinhouse',
        url: 'https://www.coinhouse.com/r/157530',
        logo: <CoinhouseLogo width={150} />,
        desc: t('app:exchange.coinhouse'),
      },
      {
        key: 'changelly',
        url: 'https://changelly.com/?ref_id=aac789605a01',
        logo: <ChangellyLogo width={150} />,
        desc: t('app:exchange.changelly'),
      },
      {
        key: 'coinmama',
        url: 'http://go.coinmama.com/visit/?bta=51801&nci=5343',
        logo: <CoinmamaLogo width={150} />,
        desc: t('app:exchange.coinmama'),
      },
    ]

    return (
      <Box pb={6}>
        <Box ff="Museo Sans|Regular" color="dark" fontSize={7} mb={5}>
          {t('app:exchange.title')}
        </Box>
        <Box flow={5}>{cards.map(card => <ExchangeCard key={card.key} t={t} card={card} />)}</Box>
      </Box>
    )
  }
}

export default translate()(ExchangePage)
