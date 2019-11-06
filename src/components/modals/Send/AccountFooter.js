// @flow

import React from 'react'
import { Trans } from 'react-i18next'
import { getAccountUnit, getAccountCurrency } from '@ledgerhq/live-common/lib/account'
import type { AccountLike } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import { CurrencyCircleIcon } from 'components/base/CurrencyBadge'
import FormattedVal from 'components/base/FormattedVal'

type Props = {
  account: AccountLike,
}

const AccountFooter = ({ account }: Props) => {
  const accountUnit = getAccountUnit(account)
  const currency = getAccountCurrency(account)
  return (
    <Box flow={2} horizontal flex={1}>
      <CurrencyCircleIcon size={40} currency={currency} />
      <Box grow>
        <Label>
          <Trans i18nKey="send.totalBalance" />
        </Label>
        {accountUnit && (
          <FormattedVal
            style={{ width: 'auto' }}
            color="palette.text.shade100"
            val={account.balance}
            unit={accountUnit}
            showCode
          />
        )}
      </Box>
    </Box>
  )
}

export default AccountFooter
