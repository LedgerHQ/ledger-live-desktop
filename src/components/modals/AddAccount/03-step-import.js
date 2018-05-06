// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'

import type { CryptoCurrency, Account } from '@ledgerhq/live-common/lib/types'

import Box from 'components/base/Box'

import AccountCard from 'components/DashboardPage/AccountCard'

const AccountsContainer = styled(Box).attrs({
  horizontal: true,
  m: -2,
})`
  flex-wrap: wrap;
`
const AccountItemWrapper = styled(Box).attrs({
  p: 2,
})`
  width: 50%;
`
const AccountItem = styled(AccountCard)`
  ${p => p.selected && `box-shadow: inset 0 0 0 1px ${p.theme.colors.wallet};`};
`

type Props = {
  scannedAccounts: Account[],
  selectedAccounts: Account[],
  existingAccounts: Account[],
  onToggleAccount: Function,
}

function StepImport(props: Props) {
  const { scannedAccounts, selectedAccounts, existingAccounts, onToggleAccount } = props
  return (
    <Box flow={4}>
      {scannedAccounts.map(account => {
        const isSelected = selectedAccounts.find(a => a.id === account.id)
        const isExisting = existingAccounts.find(a => a.id === account.id && a.archived === false)
        return (
          <Box
            bg="lightgrey"
            key={account.id}
            onClick={onToggleAccount && !isExisting ? () => onToggleAccount(account) : undefined}
          >
            {isSelected && `[SELECTED]`} {isExisting && `[ALREADY IMPORTED]`} {account.name}
          </Box>
        )
      })}
    </Box>
  )
}

export default StepImport
