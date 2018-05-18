// @flow

import React from 'react'
import { shell } from 'electron'

import type { T } from 'types/common'

import ExternalLinkIcon from 'icons/ExternalLink'
import Box, { Card } from 'components/base/Box'
import { FakeLink } from 'components/base/Link'

type CardType = {
  logo: any,
  desc: string,
  url: string,
}

export default function ExchangeCard({ t, card }: { t: T, card: CardType }) {
  const { logo, desc } = card
  return (
    <Card
      horizontal
      p={5}
      style={{ cursor: 'pointer' }}
      onClick={() => shell.openExternal(card.url)}
    >
      <Box justify="center" style={{ width: 200 }}>
        {logo}
      </Box>
      <Box shrink ff="Open Sans|Regular" fontSize={4} flow={3}>
        <Box>{desc}</Box>
        <Box horizontal align="center" color="wallet" flow={1}>
          <FakeLink>{t('exchange:visitWebsite')}</FakeLink>
          <ExternalLinkIcon size={14} />
        </Box>
      </Box>
    </Card>
  )
}
