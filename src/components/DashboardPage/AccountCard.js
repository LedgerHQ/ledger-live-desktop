// @flow

import React from 'react'

import type { Account } from 'types/common'

import IconCurrencyBitcoin from 'icons/currencies/Bitcoin'

import { AreaChart } from 'components/base/Chart'
import Bar from 'components/base/Bar'
import Box, { Card } from 'components/base/Box'
import Defer from 'components/base/Defer'
import FormattedVal from 'components/base/FormattedVal'

const AccountCard = ({
  account,
  data,
  onClick,
}: {
  account: Account,
  data: Array<Object>,
  onClick: Function,
}) => (
  <Card p={4} flow={4} flex={1} style={{ cursor: 'pointer' }} onClick={onClick}>
    <Box horizontal ff="Open Sans|SemiBold" flow={3} align="center">
      <Box align="center" justify="center" style={{ color: '#fcb653' }}>
        <IconCurrencyBitcoin height={20} width={20} />
      </Box>
      <Box>
        <Box style={{ textTransform: 'uppercase' }} fontSize={0} color="warmGrey">
          {account.type}
        </Box>
        <Box fontSize={4} color="dark">
          {account.name}
        </Box>
      </Box>
    </Box>
    <Bar size={1} color="argile" />
    <Box grow justify="center" color="dark">
      {account.data && (
        <FormattedVal
          alwaysShowSign={false}
          color="dark"
          currency={account.type}
          showCode
          val={account.data.balance}
        />
      )}
    </Box>
    <Defer>
      <AreaChart
        tiny
        id={`account-chart-${account.id}`}
        color="#fcb653"
        height={52}
        data={data}
        strokeWidth={1}
        linearGradient={[[5, 0.4], [80, 0]]}
      />
    </Defer>
  </Card>
)

export default AccountCard
