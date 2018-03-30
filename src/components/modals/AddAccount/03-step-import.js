// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'
import { getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import type { Currency } from '@ledgerhq/currencies/lib/types'
import type { Account } from '@ledgerhq/wallet-common/lib/types'

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
  accountsImport: Object,
  archivedAccounts: Account[],
  currency: Currency | null,
  importProgress: boolean,
  onSelectAccount?: Function,
  selectedAccounts?: Array<number>,
}

function StepImport(props: Props) {
  const hasAccountsImports = Object.keys(props.accountsImport).length > 0
  const unit = props.currency !== null && getDefaultUnitByCoinType(props.currency.coinType)
  return (
    <Box>
      {props.importProgress ? (
        <Box alignItems="center">In progress...</Box>
      ) : (
        hasAccountsImports && <Box mb={-2}>Accounts</Box>
      )}
      {hasAccountsImports && (
        <AccountsContainer pt={5}>
          {Object.keys(props.accountsImport).map(k => {
            const a = props.accountsImport[k]
            return (
              <AccountItemWrapper key={a.id}>
                <AccountItem
                  selected={props.selectedAccounts && props.selectedAccounts.includes(a.id)}
                  onClick={props.onSelectAccount && props.onSelectAccount(a.id)}
                  account={{
                    ...a,
                    coinType: props.currency && props.currency.coinType,
                    name: `Account ${a.accountIndex}`,
                    currency: props.currency,
                    unit,
                  }}
                  counterValue="USD"
                  daysCount={365}
                />
              </AccountItemWrapper>
            )
          })}
        </AccountsContainer>
      )}
      {!props.importProgress &&
        props.archivedAccounts.length > 0 && (
          <Fragment>
            <Box pb={3}>Archived accounts</Box>
            <AccountsContainer>
              {props.archivedAccounts.map(a => (
                <AccountItemWrapper key={a.id}>
                  <AccountItem
                    selected={props.selectedAccounts && props.selectedAccounts.includes(a.id)}
                    onClick={props.onSelectAccount && props.onSelectAccount(a.id)}
                    account={a}
                    counterValue="USD"
                    daysCount={365}
                  />
                </AccountItemWrapper>
              ))}
            </AccountsContainer>
          </Fragment>
        )}
    </Box>
  )
}

StepImport.defaultProps = {
  onSelectAccount: undefined,
  selectedAccounts: [],
}

export default StepImport
