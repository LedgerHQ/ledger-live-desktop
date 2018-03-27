// @flow

import React from 'react'
import styled from 'styled-components'
import type { Account } from '@ledgerhq/wallet-common/lib/types'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Text from 'components/base/Text'

const Container = styled(Box)`
  border: 1px solid ${p => p.theme.colors.alertRed};
`

type Props = {
  archivedAccounts: Account[],
  updateAccount: Function,
}

function RestoreAccounts(props: Props) {
  const { archivedAccounts, updateAccount } = props
  return (
    <Container>
      <Text fontSize={3} fontWeight="bold">
        {'Restore account'}
      </Text>
      {archivedAccounts.map(account => (
        <Box key={account.id} horizontal flow={2} alignItems="center">
          <Text>{account.name}</Text>
          <Button primary onClick={() => updateAccount({ ...account, archived: false })}>
            {'restore'}
          </Button>
        </Box>
      ))}
    </Container>
  )
}

export default RestoreAccounts
