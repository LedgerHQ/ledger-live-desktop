// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { formatBTC } from 'helpers/format'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Checkbox from 'components/base/Checkbox'
import Input from 'components/base/Input'

type Props = {
  t: T,
  accounts: Array<Object>,
  onImportAccounts: Function,
}

type State = {
  accountsSelected: Array<string>,
  accountsName: Object,
}

class ImportAccounts extends PureComponent<Props, State> {
  state = {
    accountsSelected: [],
    accountsName: this.props.accounts.reduce((result, value, index) => {
      result[value.id] = {
        placeholder: this.props.t(`addAccount.import.placeholder`, {
          index: index + 1,
        }),
      }

      return result
    }, {}),
  }

  handleSelectAccount = (id: string, selected: boolean) => () =>
    this.setState(prev => ({
      accountsSelected: selected
        ? prev.accountsSelected.filter(v => v !== id)
        : [...prev.accountsSelected, id],
    }))

  handleChangeInput = (id: string) => (value: string) =>
    this.setState(prev => ({
      accountsName: {
        ...prev.accountsName,
        [id]: {
          ...prev.accountsName[id],
          value,
        },
      },
    }))

  handleImportAccounts = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { accounts, onImportAccounts } = this.props
    const { accountsSelected, accountsName } = this.state

    const importAccounts = accountsSelected.map(id => ({
      ...accounts.find(a => a.id === id),
      name: accountsName[id].value || accountsName[id].placeholder,
    }))

    onImportAccounts(importAccounts)
  }

  render() {
    const { accounts } = this.props
    const { accountsSelected, accountsName } = this.state

    const canImportAccounts = accountsSelected.length > 0

    return (
      <Box>
        <Box>Import Accounts</Box>
        <form onSubmit={this.handleImportAccounts}>
          <Box flow={3}>
            {accounts.map(account => {
              const selected = accountsSelected.includes(account.id)
              const accountName = accountsName[account.id]
              return (
                <Box key={account.id} horizontal flow={10}>
                  <Box>
                    <Checkbox
                      checked={selected}
                      onChange={this.handleSelectAccount(account.id, selected)}
                    />
                  </Box>
                  <Box grow>
                    <Box>
                      <Input
                        type="text"
                        disabled={!selected}
                        placeholder={accountName.placeholder}
                        value={accountName.value || ''}
                        onChange={this.handleChangeInput(account.id)}
                      />
                    </Box>
                    <Box>Balance: {formatBTC(account.balance)}</Box>
                    <Box>Transactions: {account.transactions.length}</Box>
                  </Box>
                </Box>
              )
            })}
            <Box horizontal justify="flex-end">
              <Button primary disabled={!canImportAccounts} type="submit">
                Import
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    )
  }
}

export default translate()(ImportAccounts)
