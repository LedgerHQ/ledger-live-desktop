// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { accounts } from 'components/SelectAccount/stories'

import RequestAmount from 'components/RequestAmount'

const stories = storiesOf('Components', module)

stories.add('RequestAmount', () => (
  <RequestAmount
    t={k => k}
    counterValue="USD"
    account={accounts[0]}
    onChange={action('onChange')}
    value={3}
    max={400000000000}
  />
))
