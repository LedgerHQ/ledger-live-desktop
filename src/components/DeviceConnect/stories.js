// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { select, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import DeviceConnect from 'components/DeviceConnect'

const stories = storiesOf('Components', module)

const devices = [
  {
    manufacturer: 'Ledger',
    product: 'Nano S',
    vendorId: '1',
    productId: '11',
    path: '111',
  },
  {
    manufacturer: 'Ledger',
    product: 'Blue',
    vendorId: '2',
    productId: '22',
    path: '222',
  },
  {
    manufacturer: 'Ledger',
    product: 'Nano S',
    vendorId: '3',
    productId: '33',
    path: '333',
  },
]

stories.add('DeviceConnect', () => (
  <DeviceConnect
    accountName={text('accountName', 'Test Account')}
    coinType={select('coinType', [0, 1, 145, 156, 2, 3, 5], 0)}
    appOpened={select('appOpened', ['', 'success', 'fail'], '')}
    devices={devices.slice(0, select('devices', [0, 1, 2, 3], 0))}
    deviceSelected={devices[select('deviceSelected', ['', 0, 1, 2], '')] || null}
    onChangeDevice={action('onChangeDevice')}
  />
))
