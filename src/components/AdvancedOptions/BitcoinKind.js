// @flow
import React from 'react'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'
import CheckBox from 'components/base/CheckBox'
import Label from 'components/base/Label'
import LabelInfoTooltip from 'components/base/LabelInfoTooltip'
import Spoiler from 'components/base/Spoiler'

type Props = {
  isRBF: boolean,
  onChangeRBF: boolean => void,
  t: *,
}

export default translate()(({ isRBF, onChangeRBF, t }: Props) => (
  <Spoiler title={t('app:send.steps.amount.advancedOptions')}>
    <Box horizontal align="center" flow={5}>
      <Box style={{ width: 200 }}>
        <Label>
          <span>{t('app:send.steps.amount.useRBF')}</span>
          <LabelInfoTooltip ml={1} text={t('app:send.steps.amount.useRBF')} />
        </Label>
      </Box>
      <Box grow>
        <CheckBox isChecked={isRBF} onChange={onChangeRBF} />
      </Box>
    </Box>

    {/*
    <Box horizontal align="flex-start" flow={5}>
      <Box style={{ width: 200 }}>
        <Label>
          <span>{t('app:send.steps.amount.message')}</span>
        </Label>
      </Box>
      <Box grow>
        <Textarea />
      </Box>
    </Box>
    */}
  </Spoiler>
))
