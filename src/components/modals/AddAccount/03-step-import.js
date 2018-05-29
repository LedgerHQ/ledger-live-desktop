// @flow

import React from 'react'

import type { Account } from '@ledgerhq/live-common/lib/types'

import Box from 'components/base/Box'
import CheckBox from 'components/base/CheckBox'
import FormattedVal from 'components/base/FormattedVal'

type Props = {
  scannedAccounts: Account[],
  selectedAccounts: Account[],
  existingAccounts: Account[],
  onToggleAccount?: Account => void,
}

function StepImport(props: Props) {
  const { scannedAccounts, selectedAccounts, existingAccounts, onToggleAccount } = props
  return (
    <Box flow={4}>
      <strong>(design is not yet integrated!)</strong>
      {scannedAccounts.map(account => {
        const isSelected = selectedAccounts.find(a => a.id === account.id)
        const isExisting = existingAccounts.find(a => a.id === account.id && a.archived === false)
        return (
          <Box
            horizontal
            key={account.id}
            onClick={onToggleAccount && !isExisting ? () => onToggleAccount(account) : undefined}
          >
            <CheckBox isChecked={!!isSelected} onChange={onToggleAccount} />
            <Box grow fontSize={6} style={{ paddingLeft: 10 }}>
              {account.name}
            </Box>
            <FormattedVal
              alwaysShowSign={false}
              color="warmGrey"
              fontSize={6}
              showCode
              unit={account.currency.units[0]}
              val={account.balance}
            />
          </Box>
        )
      })}
    </Box>
  )
}

export default StepImport
