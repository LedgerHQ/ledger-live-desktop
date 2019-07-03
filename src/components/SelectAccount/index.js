// @flow

import {
  flattenAccounts,
  getAccountCurrency,
  getAccountUnit,
} from '@ledgerhq/live-common/lib/account'
import Box from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import Select from 'components/base/Select'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import React, { useCallback } from 'react'
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

const getOptionValue = account => account.id

const defaultFilter = createFilter({
  stringify: ({ data: account }) =>
    account.type === 'Account'
      ? `${account.currency.ticker}|${account.currency.name}|${account.name}`
      : `${account.token.ticker}|${account.token.name}`,
})
const filterOption = o => (candidate, input) => {
  const selfMatches = defaultFilter(candidate, input)
  if (selfMatches) return selfMatches
  if (candidate.data.type === 'Account' && o.withTokenAccounts) {
    const { tokenAccounts } = candidate.data
    if (tokenAccounts) {
      for (let i = 0; i < tokenAccounts.length; i++) {
        const ta = tokenAccounts[i]
        if (defaultFilter({ value: getOptionValue(ta), data: ta }, input)) {
          return true
        }
      }
    }
  }
  return false
}

const AccountOption = React.memo(
  ({ account, isValue }: { account: Account | TokenAccount, isValue?: boolean }) => {
    const currency = getAccountCurrency(account)
    const unit = getAccountUnit(account)
    const name = account.type === 'Account' ? account.name : currency.name

    return (
      <Box grow horizontal alignItems="center" flow={2}>
        {!isValue && account.type === 'TokenAccount' ? tokenTick : null}
        <CryptoCurrencyIcon currency={currency} size={16} />
        <Ellipsis ff="Open Sans|SemiBold" color="dark" fontSize={4}>
          {name}
        </Ellipsis>
        <Box>
          <FormattedVal color="grey" val={account.balance} unit={unit} showCode disableRounding />
        </Box>
      </Box>
    )
  },
)

const renderValue = ({ data }: { data: Account | TokenAccount }) => (
  <AccountOption account={data} isValue />
)

const renderOption = ({ data }: { data: Account | TokenAccount }) => (
  <AccountOption account={data} />
)

type Props = {
  withTokenAccounts?: boolean,
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
  filter,
  t,
  ...props
}: Props) => {
  const filtered: Account[] = filter ? accounts.filter(filter) : accounts
  const all = withTokenAccounts ? flattenAccounts(filtered) : filtered
  const selectedOption = value ? all.find(o => o.id === value.id) : null
  const onChangeCallback = useCallback(
    (option: ?(Account | TokenAccount)) => {
      if (!option) {
        onChange(null)
      } else {
        const parentAccount =
          option.type === 'TokenAccount' ? accounts.find(a => a.id === option.parentId) : null
        onChange(option, parentAccount)
      }
    },
    [accounts, onChange],
  )
  return (
    <Select
      {...props}
      value={selectedOption}
      options={all}
      getOptionValue={getOptionValue}
      renderValue={renderValue}
      renderOption={renderOption}
      filterOption={filterOption({ withTokenAccounts })}
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
