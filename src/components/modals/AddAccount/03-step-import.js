// @flow

import React from 'react'

import type { Account } from '@ledgerhq/live-common/lib/types'

import Box from 'components/base/Box'

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
