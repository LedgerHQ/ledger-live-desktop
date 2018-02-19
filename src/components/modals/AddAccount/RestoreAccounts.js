// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Text from 'components/base/Text'

import type { Accounts } from 'types/common'

const Container = styled(Box)`
  border: 1px solid ${p => p.theme.colors.grenade};
`

type Props = {
  archivedAccounts: Accounts,
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
