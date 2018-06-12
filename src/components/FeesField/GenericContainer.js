// @flow

import React from 'react'

import Box from 'components/base/Box'
import Label from 'components/base/Label'
import LabelInfoTooltip from 'components/base/LabelInfoTooltip'
import { translate } from 'react-i18next'

export default translate()(
  ({ help, children, t }: { help: string, children: React$Node, t: * }) => (
    <Box flow={1}>
      <Label>
        <span>{t('app:send.steps.amount.fees')}</span>
        {help ? <LabelInfoTooltip ml={1} text={help} /> : null}
      </Label>
      <Box horizontal flow={5}>
        {children}
      </Box>
    </Box>
  ),
)
