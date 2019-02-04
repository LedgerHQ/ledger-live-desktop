// @flow

import React from 'react'

import Box from 'components/base/Box'
import { InteractiveLabel } from 'components/base/Label'
import IconExternalLink from 'icons/ExternalLink'
import { translate } from 'react-i18next'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'
import { track } from 'analytics/segment'

export default translate()(({ children, t }: { children: React$Node, t: * }) => (
  <Box flow={1}>
    <InteractiveLabel
      Icon={IconExternalLink}
      onClick={() => {
        openURL(urls.feesMoreInfo)
        track('Send Flow Fees Help Requested')
      }}
      label={t('send.steps.amount.fees')}
    />
    <Box horizontal flow={5}>
      {children}
    </Box>
  </Box>
))
