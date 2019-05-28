// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { Account } from '@ledgerhq/live-common/lib/types'

import { darken } from 'styles/helpers'

import Box, { Tabbable } from 'components/base/Box'
import CheckBox from 'components/base/CheckBox'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import FormattedVal from 'components/base/FormattedVal'
import Input from 'components/base/Input'
import { MAX_ACCOUNT_NAME_SIZE } from 'config/constants'

type Props = {
  account: Account,
  isChecked: boolean,
  isDisabled?: boolean,
  autoFocusInput?: boolean,
  accountName: string,
  onToggleAccount?: (Account, boolean) => void,
  onEditName?: (Account, string) => void,
  hideAmount?: boolean,
}

export default class AccountRow extends PureComponent<Props> {
  handlePreventSubmit = (e: SyntheticEvent<*>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  onToggleAccount = () => {
    const { onToggleAccount, account, isChecked } = this.props
    if (onToggleAccount) onToggleAccount(account, !isChecked)
  }

  handleChangeName = (name: string) => {
    const { onEditName, account } = this.props
    if (onEditName) onEditName(account, name)
  }

  onClickInput = (e: SyntheticEvent<*>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  onFocus = (e: *) => {
    e.target.select()
  }
  onBlur = (e: *) => {
    const { onEditName, account } = this.props
    const { value } = e.target
    if (!value && onEditName) {
      // don't leave an empty input on blur
      onEditName(account, account.name)
    }
  }

  _input = null
  overflowStyles = { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }
  render() {
    const {
      account,
      isChecked,
      onEditName,
      accountName,
      isDisabled,
      autoFocusInput,
      hideAmount,
    } = this.props
    return (
      <AccountRowContainer
        isDisabled={isDisabled}
        onClick={isDisabled ? null : this.onToggleAccount}
      >
        <CryptoCurrencyIcon currency={account.currency} size={16} />
        <Box shrink grow ff="Open Sans|SemiBold" color="dark" fontSize={4}>
          {onEditName ? (
            <Input
              style={this.overflowStyles}
              value={accountName}
              onChange={this.handleChangeName}
              onClick={this.onClickInput}
              onEnter={this.handlePreventSubmit}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              maxLength={MAX_ACCOUNT_NAME_SIZE}
              editInPlace
              autoFocus={autoFocusInput}
            />
          ) : (
            <div style={this.overflowStyles}>{accountName}</div>
          )}
        </Box>
        {!hideAmount ? (
          <FormattedVal
            val={account.balance}
            unit={account.unit}
            style={{ textAlign: 'right', width: 'auto' }}
            showCode
            fontSize={4}
            color="grey"
          />
        ) : null}
        {!isDisabled ? (
          <CheckBox disabled isChecked={isChecked || !!isDisabled} />
        ) : (
          <div style={{ width: 20 }} />
        )}
      </AccountRowContainer>
    )
  }
}

const AccountRowContainer = styled(Tabbable).attrs({
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
    background-color: ${p => darken(p.theme.colors.lightGrey, 0.015)};
  }

  &:active {
    background-color: ${p => darken(p.theme.colors.lightGrey, 0.03)};
  }
`
