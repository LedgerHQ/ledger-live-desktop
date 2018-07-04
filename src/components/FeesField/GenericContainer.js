// @flow

import React from 'react'

import Box from 'components/base/Box'
import LabelWithExternalIcon from 'components/base/LabelWithExternalIcon'
import { translate } from 'react-i18next'
import { openURL } from 'helpers/linking'
import { urls } from 'config/support'
import { track } from 'analytics/segment'

export default translate()(({ children, t }: { children: React$Node, t: * }) => (
  <Box flow={1}>
    <LabelWithExternalIcon
      onClick={() => {
        openURL(urls.feesMoreInfo)
        track('Send Flow Fees Help Requested')
      }}
      label={t('app:send.steps.amount.fees')}
    />
    <Box horizontal flow={5}>
      {children}
    </Box>
  </Box>
))
