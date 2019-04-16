// @flow

import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'
import { createStructuredSelector } from 'reselect'

import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import type { Option } from 'components/base/Select'

import { accountsSelector } from 'reducers/accounts'

import Select from 'components/base/Select'
import FormattedVal from 'components/base/FormattedVal'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
})

const renderOption = a => {
  const { data: account } = a
  const Icon = getCryptoCurrencyIcon(account.currency)
  const { color } = account.currency

  // FIXME: we need a non-hacky way to handle text ellipsis
  const nameOuterStyle = { width: 0 }
  const nameInnerStyle = { overflow: 'hidden', textOverflow: 'ellipsis' }

  return (
    <Box grow horizontal alignItems="center" flow={2}>
      {Icon && (
        <Box style={{ width: 16, height: 16, color }}>
          <Icon size={16} />
        </Box>
      )}
      <Box grow style={nameOuterStyle} ff="Open Sans|SemiBold" color="dark" fontSize={4}>
        <Text style={nameInnerStyle} ff="Open Sans|SemiBold" color="dark" fontSize={4}>
          {account.name}
        </Text>
      </Box>
      <Box>
        <FormattedVal
          color="grey"
          val={account.balance}
          unit={account.unit}
          showCode
          disableRounding
        />
      </Box>
    </Box>
  )
}

type Props = {
  accounts: Account[],
  onChange: Option => void,
  value: ?Account,
  t: T,
}

const getOptionValue = account =>
  `${account.currency.ticker}|${account.currency.name}|${account.name}`

const RawSelectAccount = ({ accounts, onChange, value, t, ...props }: Props) => {
  const selectedOption = value ? accounts.find(o => o.id === value.id) : null
  return (
    <Select
      {...props}
      value={selectedOption}
      options={accounts}
      getOptionValue={getOptionValue}
      renderValue={renderOption}
      renderOption={renderOption}
      placeholder={t('common.selectAccount')}
      noOptionsMessage={({ inputValue }) =>
        t('common.selectAccountNoOption', { accountName: inputValue })
      }
      onChange={onChange}
    />
  )
}

export const SelectAccount = translate()(RawSelectAccount)

export default connect(mapStateToProps)(SelectAccount)
