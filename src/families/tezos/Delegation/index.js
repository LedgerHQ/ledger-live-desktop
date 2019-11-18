//  @flow
import React from 'react'
import type { AccountLike, Account } from '@ledgerhq/live-common/lib/types'
import { Trans } from 'react-i18next'
import { useDelegation } from '@ledgerhq/live-common/lib/families/tezos/bakers'

import Text from 'components/base/Text'
import Box from 'components/base/Box'
import Card from 'components/base/Box/Card'

import Header from './Header'
import Row from './Row'

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
}

const Delegation = ({ account, parentAccount }: Props) => {
  const delegation = useDelegation(account)
  if (!delegation) return null

  return (
    <>
      <Box horizontal alignItems="center">
        <Text
          ff="Inter|Medium"
          fontSize={6}
          color="palette.text.shade100"
          data-e2e="title_Delegation"
        >
          <Trans i18nKey="delegation.header" />
        </Text>
      </Box>
      <Card p={0} mt={24} mb={6}>
        <Header />
        <Row delegation={delegation} account={account} parentAccount={parentAccount} />
      </Card>
    </>
  )
}

export default Delegation
