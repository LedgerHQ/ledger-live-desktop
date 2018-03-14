// @flow

import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import noop from 'lodash/noop'
import { getIconByCoinType } from '@ledgerhq/currencies/react'

import type { T, Account } from 'types/common'

import { getVisibleAccounts } from 'reducers/accounts'

import Select from 'components/base/Select'
import FormattedVal from 'components/base/FormattedVal'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

const mapStateToProps = state => ({
  accounts: getVisibleAccounts(state),
})

const renderItem = a => {
  const Icon = getIconByCoinType(a.coinType)
  const { color } = a.currency
  return (
    <Box horizontal alignItems="center" flow={2}>
      {Icon && (
        <Box style={{ width: 16, height: 16, color }}>
          <Icon size={16} />
        </Box>
      )}
      <Box grow>
        <Text ff="Open Sans|SemiBold" color="dark" fontSize={4}>
          {a.name}
        </Text>
      </Box>
      <Box>
        <FormattedVal color="grey" val={a.balance} unit={a.unit} showCode />
      </Box>
    </Box>
  )
}

type Props = {
  accounts: Account[],
  onChange?: () => Account | void,
  value?: Account | null,
  t: T,
}

const RawSelectAccount = ({ accounts, onChange, value, t }: Props) => (
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

RawSelectAccount.defaultProps = {
  onChange: noop,
  value: undefined,
}

export const SelectAccount = translate()(RawSelectAccount)

export default connect(mapStateToProps)(SelectAccount)
