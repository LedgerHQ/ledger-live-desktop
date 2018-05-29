// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { darken } from 'styles/helpers'

import Box from 'components/base/Box'
import Radio from 'components/base/Radio'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import FormattedVal from 'components/base/FormattedVal'
import Input from 'components/base/Input'
import IconEdit from 'icons/Edit'
import IconCheck from 'icons/Check'

type Props = {
  account: Account,
  isChecked: boolean,
  isDisabled: boolean,
  onClick: Account => void,
  onAccountUpdate: Account => void,
}

type State = {
  isEditing: boolean,
  accountNameCopy: string,
}

export default class AccountRow extends PureComponent<Props, State> {
  state = {
    isEditing: false,
    accountNameCopy: '',
  }

  componentDidUpdate(prevProps, prevState) {
    const startedEditing = !prevState.isEditing && this.state.isEditing
    if (startedEditing) {
      this._input.handleSelectEverything()
    }
  }

  handleEditClick = e => {
    this.handlePreventSubmit(e)
    const { account } = this.props
    this.setState({ isEditing: true, accountNameCopy: account.name })
  }

  handleSubmitName = e => {
    this.handlePreventSubmit(e)
    const { account, onAccountUpdate, isChecked, onClick } = this.props
    const { accountNameCopy } = this.state
    const updatedAccount = { ...account, name: accountNameCopy }
    this.setState({ isEditing: false, accountNameCopy: '' })
    onAccountUpdate(updatedAccount)
    if (!isChecked) {
      onClick(updatedAccount)
    }
  }

  handlePreventSubmit = e => {
    // prevent account row to be submitted
    e.preventDefault()
    e.stopPropagation()
  }

  handleChangeName = accountNameCopy => this.setState({ accountNameCopy })

  handleReset = () => this.setState({ isEditing: false, accountNameCopy: '' })

  _input = null

  render() {
    const { account, isChecked, onClick, isDisabled } = this.props
    const { isEditing, accountNameCopy } = this.state

    return (
      <AccountRowContainer onClick={() => onClick(account)} isDisabled={isDisabled}>
        <CryptoCurrencyIcon currency={account.currency} size={16} color={account.currency.color} />
        <Box shrink grow ff="Open Sans|SemiBold" color="dark" fontSize={4}>
          {isEditing ? (
            <Input
              containerProps={{ style: { width: 260 } }}
              value={accountNameCopy}
              onChange={this.handleChangeName}
              onClick={this.handlePreventSubmit}
              onEnter={this.handleSubmitName}
              onEsc={this.handleReset}
              renderRight={
                <InputRight onClick={this.handleSubmitName}>
                  <IconCheck size={16} />
                </InputRight>
              }
              ref={input => (this._input = input)}
            />
          ) : (
            <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{account.name}</div>
          )}
        </Box>
        {!isEditing && (
          <Edit onClick={this.handleEditClick}>
            <IconEdit size={13} />
            <span>{'edit name'}</span>
          </Edit>
        )}
        <FormattedVal
          val={account.balance}
          unit={account.unit}
          showCode
          fontSize={4}
          color="grey"
        />
        <Radio isChecked={isChecked || isDisabled} />
      </AccountRowContainer>
    )
  }
}

const AccountRowContainer = styled(Box).attrs({
  horizontal: true,
  align: 'center',
  bg: 'lightGrey',
  px: 3,
  flow: 3,
})`
  height: 48px;
  border-radius: 4px;

  opacity: ${p => (p.isDisabled ? 0.5 : 1)};
  pointer-events: ${p => (p.isDisabled ? 'none' : 'auto')};

  &:hover {
    cursor: pointer;
    background-color: ${p => darken(p.theme.colors.lightGrey, 0.015)};
  }

  &:active {
    background-color: ${p => darken(p.theme.colors.lightGrey, 0.03)};
  }
`

const Edit = styled(Box).attrs({
  color: 'wallet',
  fontSize: 3,
  horizontal: true,
  align: 'center',
  flow: 1,
  py: 1,
})`
  display: none;
  ${AccountRowContainer}:hover & {
    display: flex;
  }
  &:hover {
    text-decoration: underline;
  }
`

const InputRight = styled(Box).attrs({
  bg: 'wallet',
  color: 'white',
  align: 'center',
  justify: 'center',
  shrink: 0,
})`
  width: 40px;
`
