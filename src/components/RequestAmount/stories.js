// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { number } from '@storybook/addon-knobs'
import { translate } from 'react-i18next'

import { accounts } from 'components/SelectAccount/stories'

import { RequestAmount } from 'components/RequestAmount'

const stories = storiesOf('Components', module)

const props = {
  counterValue: 'USD',
  lastCounterValue: 9177.69,
  account: accounts[0],
}

const RequestAmountComp = translate()(RequestAmount)

stories.add('RequestAmount', () => (
  <RequestAmountComp
    {...props}
    t={k => k}
    onChange={action('onChange')}
    value={{
      left: number('left value', 0),
      right: number('right value', 0),
    }}
  />
))
