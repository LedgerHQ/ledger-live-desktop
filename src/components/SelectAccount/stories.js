// @flow

import React, { Component } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { storiesOf } from '@storybook/react'
import { genAccount } from '@ledgerhq/live-common/lib/mock/account'

import { SelectAccount } from 'components/SelectAccount'

const stories = storiesOf('Components', module)

export const accounts: Account[] = [...Array(20)].map((_, i) => genAccount(i))

class Wrapper extends Component<any, any> {
  state = {
    value: '',
  }

  handleChange = item => this.setState({ value: item })

  render() {
    const { render } = this.props
    const { value } = this.state

    return render({ onChange: this.handleChange, value })
  }
}

stories.add('SelectAccount', () => (
  <Wrapper
    render={({ onChange, value }) => (
      <SelectAccount onChange={onChange} value={value} accounts={accounts} t={k => k} />
    )}
  />
))
