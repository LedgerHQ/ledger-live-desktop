// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, text } from '@storybook/addon-knobs'

import CurrentAddress from 'components/CurrentAddress'

import { accounts } from 'components/SelectAccount/stories'

const stories = storiesOf('Components', module)

stories.add('CurrentAddress', () => (
  <CurrentAddress
    accountName={text('accountName', '')}
    address={accounts[0].freshAddress}
    addressVerified={boolean('addressVerified', true)}
    withBadge={boolean('withBadge', false)}
    withFooter={boolean('withFooter', false)}
    withQRCode={boolean('withQRCode', false)}
    withVerify={boolean('withVerify', false)}
  />
))
