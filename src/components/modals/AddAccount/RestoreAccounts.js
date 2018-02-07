// @flow

import React from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Text from 'components/base/Text'

import type { Accounts } from 'types/common'

type Props = {
  archivedAccounts: Accounts,
  updateAccount: Function,
}

function RestoreAccounts(props: Props) {
  const { archivedAccounts, updateAccount } = props
  return (
    <Box borderWidth={1} borderColor="grenade">
      <Text fontSize={3} fontWeight="bold">
        {'Restore account'}
      </Text>
      {archivedAccounts.map(account => (
        <Box key={account.id} horizontal flow={2} align="center">
          <Text>{account.name}</Text>
          <Button primary onClick={() => updateAccount({ ...account, archived: false })}>
            {'restore'}
          </Button>
        </Box>
      ))}
    </Box>
  )
}

export default RestoreAccounts
