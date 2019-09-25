// @flow

import React, { PureComponent } from 'react'
import { T, translate } from 'react-i18next'

import partners from '@ledgerhq/live-common/lib/partners/react'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import PartnerCard from './PartnerCard'

type Props = {
  t: T,
}

class PartnersPage extends PureComponent<Props> {
  render() {
    const { t } = this.props
    return (
      <Box pb={6} selectable>
        <TrackPage category="Exchange" />
        <Box ff="Museo Sans|Regular" fontSize={7} color="palette.text.shade100">
          {t('partners.title')}
        </Box>
        <Box ff="Museo Sans|Light" fontSize={5} mb={5} color="palette.text.shade80">
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
}

export default translate()(PartnersPage)
