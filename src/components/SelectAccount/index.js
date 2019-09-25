// @flow

import {
  flattenAccounts,
  getAccountCurrency,
  getAccountUnit,
  listTokenAccounts,
} from '@ledgerhq/live-common/lib/account'
import Box from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import Select from 'components/base/Select'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import React, { useCallback, useState } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { createFilter } from 'react-select'
import { accountsSelector } from 'reducers/accounts'
import { createStructuredSelector } from 'reselect'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import Ellipsis from '../base/Ellipsis'

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
})

const tokenTick = (
  <div
    style={{
      padding: '0px 6px',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: -10,
        height: 40,
        width: 1,
        background: '#e8e8e8',
      }}
    />
  </div>
)

type Option = {
  matched: 'boolean',
  account: Account | TokenAccount,
}

const getOptionValue = option => option.account.id

const defaultFilter = createFilter({
  stringify: ({ data: account }) =>
    account.type === 'Account'
      ? `${account.currency.ticker}|${account.currency.name}|${account.name}`
      : `${account.token.ticker}|${account.token.name}`,
})
const filterOption = o => (candidate, input) => {
  const selfMatches = defaultFilter(candidate, input)
  if (selfMatches) return [selfMatches, true]

  if (candidate.data.type === 'Account' && o.withTokenAccounts) {
    const tokenAccounts = o.enforceHideEmptyTokenAccounts
      ? listTokenAccounts(candidate.data)
      : candidate.data.tokenAccounts
    if (tokenAccounts) {
      for (let i = 0; i < tokenAccounts.length; i++) {
        const ta = tokenAccounts[i]
        if (defaultFilter({ value: ta.id, data: ta }, input)) {
          return [true, false]
        }
      }
    }
  }
  return [false, false]
}

const AccountOption = React.memo(
  ({
    account,
    isValue,
    disabled,
  }: {
    account: Account | TokenAccount,
    isValue?: boolean,
    disabled?: boolean,
  }) => {
    const currency = getAccountCurrency(account)
    const unit = getAccountUnit(account)
    const name = account.type === 'Account' ? account.name : currency.name

    return (
      <Box grow horizontal alignItems="center" flow={2} style={{ opacity: disabled ? 0.2 : 1 }}>
        {!isValue && account.type === 'TokenAccount' ? tokenTick : null}
        <CryptoCurrencyIcon currency={currency} size={16} />
        <Ellipsis ff="Open Sans|SemiBold" color="palette.text.shade100" fontSize={4}>
          {name}
        </Ellipsis>
        <Box>
          <FormattedVal
            color="palette.text.shade60"
            val={account.balance}
            unit={unit}
            showCode
            disableRounding
          />
        </Box>
      </Box>
    )
  },
)

const renderValue = ({ data }: { data: Option }) => <AccountOption account={data.account} isValue />

const renderOption = ({ data }: { data: Option }) => (
  <AccountOption account={data.account} disabled={!data.matched} />
)

type Props = {
  withTokenAccounts?: boolean,
  enforceHideEmptyTokenAccounts?: boolean,
  filter?: Account => boolean,
  accounts: Account[],
  onChange: (account: ?(Account | TokenAccount), tokenAccount: ?Account) => void,
  value: ?Account,
  t: T,
}

const RawSelectAccount = ({
  accounts,
  onChange,
  value,
  withTokenAccounts,
  enforceHideEmptyTokenAccounts,
  filter,
  t,
  ...props
}: Props) => {
  const [searchInputValue, setSearchInputValue] = useState('')

  const filtered: Account[] = filter ? accounts.filter(filter) : accounts
  const all = withTokenAccounts
    ? flattenAccounts(filtered, { enforceHideEmptyTokenAccounts })
    : filtered
  const selectedOption = value
    ? {
        account: all.find(o => o.id === value.id),
      }
    : null
  const onChangeCallback = useCallback(
    (option?: Option) => {
      if (!option) {
        onChange(null)
      } else {
        const { account } = option
        const parentAccount =
          account.type === 'TokenAccount' ? accounts.find(a => a.id === account.parentId) : null
        onChange(account, parentAccount)
      }
    },
    [accounts, onChange],
  )

  const manualFilter = useCallback(
    () =>
      all.reduce((result, option) => {
        const [display, match] = filterOption({ withTokenAccounts, enforceHideEmptyTokenAccounts })(
          { data: option },
          searchInputValue,
        )

        if (display) {
          result.push({
            matched: match,
            account: option,
          })
        }
        return result
      }, []),
    [searchInputValue, all, withTokenAccounts, enforceHideEmptyTokenAccounts],
  )

  const structuredResults = manualFilter()
  return (
    <Select
      {...props}
      value={selectedOption}
      options={structuredResults}
      getOptionValue={getOptionValue}
      renderValue={renderValue}
      renderOption={renderOption}
      onInputChange={v => setSearchInputValue(v)}
      inputValue={searchInputValue}
      filterOption={false}
      isOptionDisabled={option => !option.matched}
      placeholder={t('common.selectAccount')}
      noOptionsMessage={({ inputValue }) =>
        t('common.selectAccountNoOption', { accountName: inputValue })
      }
      onChange={onChangeCallback}
    />
  )
}

export const SelectAccount = translate()(RawSelectAccount)

export default connect(mapStateToProps)(SelectAccount)
