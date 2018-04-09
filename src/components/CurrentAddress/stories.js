// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import CurrentAddress from 'components/CurrentAddress'

import { accounts } from 'components/SelectAccount/stories'

const stories = storiesOf('Components', module)

stories.add('CurrentAddress', () => (
  <CurrentAddress
    addressVerified={boolean('addressVerified', true)}
    account={accounts[0]}
    withQRCode={boolean('withQRCode', false)}
  />
))
