// @flow

import React from 'react'

import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import CurrentAddressForAccount from 'components/CurrentAddressForAccount'
import Label from 'components/base/Label'
import RequestAmount from 'components/RequestAmount'

type Props = {
  account: ?Account,
  addressVerified: ?boolean,
  amount: string | number,
  onChangeAmount: Function,
  onVerify: Function,
  t: T,
}

export default (props: Props) => (
  <Box flow={5}>
    <TrackPage category="Receive" name="Step4" />
    <Box flow={1}>
      <Label>{props.t('app:receive.steps.receiveFunds.label')}</Label>
      <RequestAmount
        account={props.account}
        onChange={props.onChangeAmount}
        value={props.amount}
        withMax={false}
      />
    </Box>
    {props.account && (
      <CurrentAddressForAccount
        account={props.account}
        addressVerified={props.addressVerified}
        amount={props.amount}
        onVerify={props.onVerify}
        withBadge
        withFooter
        withQRCode
        withVerify={props.addressVerified === false}
      />
    )}
  </Box>
)
