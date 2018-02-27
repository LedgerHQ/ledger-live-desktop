// @flow

import React from 'react'
import { getIconByCoinType } from '@ledgerhq/currencies/react'

import type { Account } from 'types/common'

import { SimpleAreaChart } from 'components/base/Chart'
import Bar from 'components/base/Bar'
import Box, { Card } from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'

const AccountCard = ({
  account,
  data,
  onClick,
}: {
  account: Account,
  data: Array<Object>,
  onClick: Function,
}) => {
  const Icon = getIconByCoinType(account.currency.coinType)

  return (
    <Card p={4} flow={4} flex={1} style={{ cursor: 'pointer' }} onClick={onClick}>
      <Box horizontal ff="Open Sans|SemiBold" flow={3} alignItems="center">
        <Box alignItems="center" justifyContent="center" style={{ color: account.currency.color }}>
          {Icon && <Icon size={20} />}
        </Box>
        <Box>
          <Box style={{ textTransform: 'uppercase' }} fontSize={0} color="graphite">
            {account.unit.code}
          </Box>
          <Box fontSize={4} color="dark">
            {account.name}
          </Box>
        </Box>
      </Box>
      <Bar size={1} color="argile" />
      <Box grow justifyContent="center" color="dark">
        <FormattedVal
          alwaysShowSign={false}
          color="dark"
          unit={account.unit}
          showCode
          val={account.balance}
        />
      </Box>
      <SimpleAreaChart
        id={`account-chart-${account.id}`}
        color={account.currency.color}
        height={52}
        data={data}
        strokeWidth={1.5}
        linearGradient={[[5, 0.2], [75, 0]]}
      />
    </Card>
  )
}

export default AccountCard
