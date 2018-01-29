// @flow

import React, { PureComponent } from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Label from 'components/base/Label'

type Props = {
  account: Object,
  onAddAccount: Function,
}

type State = {
  accountName: string,
}

class CreateAccount extends PureComponent<Props, State> {
  state = {
    accountName: '',
  }

  handleCreateAccount = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { accountName } = this.state
    const { onAddAccount, account } = this.props

    if (accountName.trim() === '') {
      return
    }

    onAddAccount({
      ...account,
      name: accountName,
    })
  }

  handleChangeInput = (value: string) =>
    this.setState({
      accountName: value,
    })

  render() {
    const { accountName } = this.state

    return (
      <Box>
        <Box>Create Account</Box>
        <form onSubmit={this.handleCreateAccount}>
          <Box flow={3}>
            <Box flow={1}>
              <Label>Account name</Label>
              <Input value={accountName} onChange={this.handleChangeInput} />
            </Box>
            <Box horizontal justify="flex-end">
              <Button primary type="submit">
                Create
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    )
  }
}

export default CreateAccount
