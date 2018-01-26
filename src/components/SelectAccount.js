// @flow

import React from 'react'
import { connect } from 'react-redux'
import values from 'lodash/values'

import type { MapStateToProps } from 'react-redux'

import { getAccounts } from 'reducers/accounts'
import Select from 'components/base/Select'
import Text from 'components/base/Text'

import type { Account } from 'types/common'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: values(getAccounts(state)),
})

type Props = {
  accounts: Array<Account>,
  onChange: () => Account | void,
  value: Account | null,
}

const SelectAccount = ({ accounts, value, onChange }: Props) => (
  <Select
    value={value}
    placeholder="Choose an account"
    items={accounts}
    keyProp="id"
    onChange={onChange}
    itemToString={item => (item ? item.name : '')}
    renderHighlight={(text, key) => (
      <Text key={key} fontWeight="bold">
        {text}
      </Text>
    )}
  />
)

export default connect(mapStateToProps)(SelectAccount)
