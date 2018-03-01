// @flow

import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import noop from 'lodash/noop'

import type { MapStateToProps } from 'react-redux'
import type { T, Accounts, Account } from 'types/common'

import { formatBTC } from 'helpers/format'

import { getVisibleAccounts } from 'reducers/accounts'

import Select from 'components/base/Select'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: getVisibleAccounts(state),
})

const renderItem = item => (
  <Box horizontal alignItems="center">
    <Box grow>
      <Text color="dark" fontSize={4} fontWeight="bold">
        {item.name}
      </Text>
    </Box>
    <Box>
      <Text color="fog" fontSize={4}>
        {formatBTC(item.balance)}
      </Text>
    </Box>
  </Box>
)

type Props = {
  accounts: Accounts,
  onChange?: () => Account | void,
  value?: Account | null,
  t: T,
}

export const SelectAccount = ({ accounts, onChange, value, t }: Props) => (
  <Select
    value={value && accounts.find(a => value && a.id === value.id)}
    renderSelected={renderItem}
    renderItem={renderItem}
    keyProp="id"
    items={accounts}
    placeholder={t('common:selectAccount')}
    fontSize={4}
    onChange={onChange}
  />
)

SelectAccount.defaultProps = {
  onChange: noop,
  value: undefined,
}

export default compose(connect(mapStateToProps), translate())(SelectAccount)
