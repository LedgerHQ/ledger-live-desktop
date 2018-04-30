// @flow

import React from 'react'

import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import Box from 'components/base/Box'
import Label from 'components/base/Label'
import SelectCurrency from 'components/SelectCurrency'

type Props = {
  onChangeCurrency: Function,
  currency?: ?CryptoCurrency,
  t: T,
}

export default (props: Props) => (
  <Box flow={1}>
    <Label>{props.t('common:currency')}</Label>
    <SelectCurrency
      placeholder={props.t('common:chooseWalletPlaceholder')}
      onChange={props.onChangeCurrency}
      value={props.currency}
    />
  </Box>
)
