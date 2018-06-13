// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { i } from 'helpers/staticPath'

import Box from 'components/base/Box'
import ExchangeCard from './ExchangeCard'

import CoinhouseLogo from './logos/coinhouse'

type Props = {
  t: T,
}

class ExchangePage extends PureComponent<Props> {
  render() {
    const { t } = this.props
    const cards = [
      {
        key: 'coinhouse',
        url: 'https://www.coinhouse.com/',
        logo: <CoinhouseLogo width={150} />,
        desc: t('app:exchange.coinhouse'),
      },
      {
        key: 'shapeshift',
        url: 'https://shapeshift.io',
        logo: <img alt="shapeshift logo" src={i('logos/shapeshift.png')} style={{ width: 150 }} />,
        desc: t('app:exchange.shapeshift'),
      },
    ]

    return (
      <Box>
        <Box ff="Museo Sans|Regular" color="dark" fontSize={7} mb={4}>
          {t('app:exchange.title')}
        </Box>
        <Box flow={5}>{cards.map(card => <ExchangeCard key={card.key} t={t} card={card} />)}</Box>
      </Box>
    )
  }
}

export default translate()(ExchangePage)
