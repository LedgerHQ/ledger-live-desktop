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
  accountsImport: Object,
  archivedAccounts: Account[],
  currency?: ?CryptoCurrency,
  importProgress: boolean,
  onSelectAccount?: Function,
  selectedAccounts?: Array<number>,
}

function StepImport(props: Props) {
  const hasAccountsImports = Object.keys(props.accountsImport).length > 0
  const unit = props.currency && props.currency.units[0]
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
                    currencyId: props.currency && props.currency.id,
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
