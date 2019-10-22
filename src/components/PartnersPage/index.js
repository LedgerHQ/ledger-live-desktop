// @flow

import React from 'react'
import { T, translate } from 'react-i18next'

import getPartners from '@ledgerhq/live-common/lib/partners/react'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import useTheme from 'hooks/useTheme'
import PartnerCard from './PartnerCard'

type Props = {
  t: T,
}

const PartnersPage = ({ t }: Props) => {
  const isDark = useTheme('colors.palette.type') === 'dark'
  const partners = getPartners(isDark)
  return (
    <Box pb={6} selectable>
      <TrackPage category="Exchange" />
      <Box ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100">
        {t('partners.title')}
      </Box>
      <Box ff="Inter|Light" fontSize={5} mb={5} color="palette.text.shade80">
        {t('partners.desc')}
      </Box>
      <Box flow={3}>
        {partners.map(card => (
          <PartnerCard key={card.id} t={t} card={card} />
        ))}
      </Box>
    </Box>
  )
}

export default translate()(PartnersPage)
