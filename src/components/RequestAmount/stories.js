// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { text } from '@storybook/addon-knobs'

import { accounts } from 'components/SelectAccount/stories'

import { RequestAmount } from 'components/RequestAmount'

const stories = storiesOf('Components/RequestAmount', module)

const props = {
  counterValue: 'USD',
  lastCounterValue: 9177.69,
  account: accounts[0],
}

stories.add('basic', () => (
  <RequestAmount
    {...props}
    onChange={action('onChange')}
    value={{
      left: text('left value', 0),
      right: text('right value', 0),
    }}
  />
))
