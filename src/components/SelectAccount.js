// @flow

import React from 'react'
import { connect } from 'react-redux'

import type { MapStateToProps } from 'react-redux'

import { getAccounts } from 'reducers/accounts'
import Select from 'components/base/Select'

import type { Account } from 'types/common'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: Object.entries(getAccounts(state)).map(([, account]: [string, any]) => account),
})

type Props = {
  accounts: Array<Account>,
  onChange: () => Account | void,
  value: Account | null,
}

const SelectAccount = ({ accounts, value, onChange }: Props) => (
  <Select
    value={value}
    renderSelected={item => item.name}
    renderItem={item => (
      <div key={item.id}>
        {item.name} - {item.data.balance}
      </div>
    )}
    keyProp="id"
    items={accounts}
    placeholder="Choose an account"
    onChange={onChange}
  />
)

export default connect(mapStateToProps)(SelectAccount)
