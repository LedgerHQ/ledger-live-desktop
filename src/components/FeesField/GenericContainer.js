// @flow

import React from 'react'

import Box from 'components/base/Box'
import LabelWithExternalIcon from 'components/base/LabelWithExternalIcon'
import { translate } from 'react-i18next'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'
import { track } from 'analytics/segment'

export default translate()(
  ({ children, header, t }: { children: React$Node, header?: React$Node, t: * }) => (
    <Box flow={1}>
      <Box horizontal alignItems="center" justifyContent="space-between">
        <LabelWithExternalIcon
          onClick={() => {
            openURL(urls.feesMoreInfo)
            track('Send Flow Fees Help Requested')
          }}
          label={t('send.steps.amount.fees')}
        />
        {header}
      </Box>
      {children}
    </Box>
  ),
)
