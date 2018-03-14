// @flow

import React, { PureComponent } from 'react'
import { storiesOf } from '@storybook/react'

import Pills from 'components/base/Pills'

const stories = storiesOf('Components/base', module)

type State = {
  key: string,
}

class Wrapper extends PureComponent<any, State> {
  state = {
    key: 'day',
  }
  render() {
    const { key } = this.state
    return (
      <Pills
        activeKey={key}
        items={[
          { key: 'day', label: 'Day' },
          { key: 'week', label: 'Week' },
          { key: 'month', label: 'Month' },
          { key: 'year', label: 'Year' },
        ]}
        onChange={item => this.setState({ key: item.key })}
      />
    )
  }
}

stories.add('Pills', () => <Wrapper />)
