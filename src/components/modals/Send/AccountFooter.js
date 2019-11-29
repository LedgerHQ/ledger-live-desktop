// @flow

import React from 'react'
import { Trans } from 'react-i18next'
import {
  getAccountUnit,
  getMainAccount,
  getAccountCurrency,
} from '@ledgerhq/live-common/lib/account'
import type { AccountLike, TransactionStatus, Account } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import { CurrencyCircleIcon } from 'components/base/CurrencyBadge'
import FormattedVal from 'components/base/FormattedVal'

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  status: TransactionStatus,
}

const AccountFooter = ({ account, parentAccount, status }: Props) => {
  const currency = getAccountCurrency(account)
  const mainAccount = getMainAccount(account, parentAccount)
  const accountUnit = getAccountUnit(mainAccount)
  return (
    <Box flow={2} horizontal flex={1}>
      <CurrencyCircleIcon size={40} currency={currency} />
      <Box grow>
        <Label>
          <Trans i18nKey="send.footer.estimatedFees" />
        </Label>
        {accountUnit && (
          <FormattedVal
            style={{ width: 'auto' }}
            color="palette.text.shade100"
            val={status.estimatedFees}
            unit={accountUnit}
            showCode
          />
        )}
      </Box>
    </Box>
  )
}

export default AccountFooter
