// @flow

import React from 'react'

import type { Account } from '@ledgerhq/wallet-common/lib/types'
import type { T } from 'types/common'

import Box from 'components/base/Box'
import CurrentAddress from 'components/CurrentAddress'
import Label from 'components/base/Label'
import SelectAccount from 'components/SelectAccount'
import RequestAmount from 'components/RequestAmount'

type Props = {
  account: Account | null,
  addressVerified: boolean | null,
  amount: string | number,
  onChangeAmount: Function,
  onVerify: Function,
  t: T,
}

export default (props: Props) => (
  <Box flow={5}>
    <Box flow={1}>
      <Label>{props.t('receive:steps.chooseAccount.label')}</Label>
      <SelectAccount disabled value={props.account} />
    </Box>
    <Box flow={1}>
      <Label>{props.t('receive:steps.receiveFunds.label')}</Label>
      <RequestAmount
        account={props.account}
        onChange={props.onChangeAmount}
        value={props.amount}
        withMax={false}
      />
    </Box>
    <CurrentAddress
      address={props.account && props.account.address}
      addressVerified={props.addressVerified}
      amount={props.amount}
      onVerify={props.onVerify}
      withBadge
      withFooter
      withQRCode
      withVerify={props.addressVerified === false}
    />
  </Box>
)
