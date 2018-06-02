// @flow
import React from 'react'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import Spoiler from 'components/base/Spoiler'

type Props = {
  gasLimit: number,
  onChangeGasLimit: (?number) => void,
  t: *,
}

export default translate()(({ gasLimit, onChangeGasLimit, t }: Props) => (
  <Spoiler title="Advanced options">
    <Box horizontal align="center" flow={5}>
      <Box style={{ width: 200 }}>
        <Label>
          <span>{t('send:steps.amount.ethereumGasLimit')}</span>
        </Label>
      </Box>
      <Box grow>
        <Input
          value={gasLimit}
          onChange={str => {
            const gasLimit = parseInt(str, 10)
            if (!isNaN(gasLimit) && isFinite(gasLimit)) onChangeGasLimit(gasLimit)
            else onChangeGasLimit(0x5208)
          }}
        />
      </Box>
    </Box>
  </Spoiler>
))
