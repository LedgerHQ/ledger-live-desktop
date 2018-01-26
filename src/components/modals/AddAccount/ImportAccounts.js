// @flow

import React, { PureComponent } from 'react'

import { formatBTC } from 'helpers/format'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

type Props = {
  accounts: Array<Object>,
  onImportAccounts: Function,
}

type State = {
  accountsSelected: Array<string>,
}

class ImportAccounts extends PureComponent<Props, State> {
  state = {
    accountsSelected: [],
  }

  handleSelectAccount = (id: string, selected: boolean) => () =>
    this.setState(prev => ({
      accountsSelected: selected
        ? prev.accountsSelected.filter(v => v !== id)
        : [...prev.accountsSelected, id],
    }))

  render() {
    const { accounts, onImportAccounts } = this.props
    const { accountsSelected } = this.state

    const canImportAccounts = accountsSelected.length > 0

    return (
      <Box>
        <Box>Import Accounts</Box>
        <Box>
          {accounts.map(account => {
            const selected = accountsSelected.includes(account.id)
            return (
              <Box
                key={account.id}
                horizontal
                flow={10}
                onClick={this.handleSelectAccount(account.id, selected)}
              >
                <Box>{selected ? 'yes' : 'no'}</Box>
                <Box>
                  <Box>Balance: {formatBTC(account.balance)}</Box>
                  <Box>Transactions: {account.transactions.length}</Box>
                </Box>
              </Box>
            )
          })}
        </Box>
        <Box>
          <Button
            primary
            disabled={!canImportAccounts}
            onClick={onImportAccounts(accountsSelected)}
          >
            Import accounts
          </Button>
        </Box>
      </Box>
    )
  }
}

export default ImportAccounts
