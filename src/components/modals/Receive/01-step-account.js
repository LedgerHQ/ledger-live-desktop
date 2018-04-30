// @flow

import React from 'react'

import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import Box from 'components/base/Box'
import Label from 'components/base/Label'
import SelectAccount from 'components/SelectAccount'

type Props = {
  account: ?Account,
  onChangeAccount: Function,
  t: T,
}

export default (props: Props) => (
  <Box flow={1}>
    <Label>{props.t('receive:steps.chooseAccount.label')}</Label>
    <SelectAccount onChange={props.onChangeAccount} value={props.account} />
  </Box>
)
