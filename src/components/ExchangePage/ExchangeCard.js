// @flow

import React, { PureComponent } from 'react'
import { openURL } from 'helpers/linking'

import type { T } from 'types/common'

import ExternalLinkIcon from 'icons/ExternalLink'
import Box, { Card } from 'components/base/Box'
import { FakeLink } from 'components/base/Link'

type CardType = {
  id: string,
  logo: any,
  url: string,
}

export default class ExchangeCard extends PureComponent<{ t: T, card: CardType }> {
  onClick = () => {
    const { card } = this.props
    openURL(card.url, 'VisitExchange', { id: card.id })
  }
  render() {
    const {
      card: { logo, id },
      t,
    } = this.props
    return (
      <Card horizontal py={5} px={6}>
        <Box justify="center" style={{ width: 200 }}>
          {logo}
        </Box>
        <Box shrink ff="Open Sans|Regular" fontSize={4} flow={3}>
          <Box>{t(`exchange.${id}`)}</Box>
          <Box horizontal align="center" color="wallet" flow={1}>
            <FakeLink onClick={this.onClick}>{t('exchange.visitWebsite')}</FakeLink>
            <ExternalLinkIcon size={14} />
          </Box>
        </Box>
      </Card>
    )
  }
}
