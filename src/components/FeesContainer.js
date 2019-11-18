// @flow

import React from 'react'

import Box from 'components/base/Box'
import LabelWithExternalIcon from 'components/base/LabelWithExternalIcon'
import { translate } from 'react-i18next'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'
import { track } from 'analytics/segment'

export default translate()(
  ({
    children,
    header,
    t,
    i18nKeyOverride,
  }: {
    children: React$Node,
    header?: React$Node,
    i18nKeyOverride?: string,
    t: *,
  }) => (
    <Box flow={1}>
      <Box horizontal alignItems="center" justifyContent="space-between">
        <LabelWithExternalIcon
          onClick={() => {
            openURL(urls.feesMoreInfo)
            track('Send Flow Fees Help Requested')
          }}
          label={t(i18nKeyOverride || 'send.steps.details.fees')}
        />
        {header}
      </Box>
      {children}
    </Box>
  ),
)
