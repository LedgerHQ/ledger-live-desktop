// @flow

import React, { PureComponent } from 'react'
import { openURL } from 'helpers/linking'

import type { T } from 'types/common'

import ExternalLinkIcon from 'icons/ExternalLink'
import Box, { Card } from 'components/base/Box'
import { FakeLink } from 'components/base/Link'

type CardType = {
  id: string,
  Logo: any,
  url: string,
}

export default class PartnerCard extends PureComponent<{ t: T, card: CardType }> {
  onClick = () => {
    const { card } = this.props
    openURL(card.url, 'VisitPartner', { id: card.id })
  }

  render() {
    const {
      card: { Logo, id },
      t,
    } = this.props
    return (
      <Card horizontal py={5} px={6}>
        <Box justify="center" style={{ width: 180, marginRight: 32 }}>
          <Logo width={180} />
        </Box>
        <Box shrink ff="Inter|Regular" fontSize={4} flow={3}>
          <Box>{t(`partners.${id}`)}</Box>
          <Box horizontal align="center" color="wallet" flow={1}>
            <FakeLink onClick={this.onClick}>{t('partners.visitWebsite')}</FakeLink>
            <ExternalLinkIcon size={14} />
          </Box>
        </Box>
      </Card>
    )
  }
}
