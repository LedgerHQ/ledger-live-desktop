// @flow
import React from 'react'
import { BigNumber } from 'bignumber.js'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import Spoiler from 'components/base/Spoiler'

type Props = {
  gasLimit: BigNumber,
  onChangeGasLimit: BigNumber => void,
  t: *,
}

export default translate()(({ gasLimit, onChangeGasLimit, t }: Props) => (
  <Spoiler title={t('send.steps.amount.advancedOptions')}>
    <Box horizontal align="center" flow={5}>
      <Box style={{ width: 200 }}>
        <Label>
          <span>{t('send.steps.amount.ethereumGasLimit')}</span>
        </Label>
      </Box>
      <Box grow>
        <Input
          value={gasLimit}
          onChange={str => {
            const gasLimit = BigNumber(str || 0)
            if (!gasLimit.isNaN() && gasLimit.isFinite()) onChangeGasLimit(gasLimit)
            else onChangeGasLimit(BigNumber(0x5208))
          }}
        />
      </Box>
    </Box>
  </Spoiler>
))
