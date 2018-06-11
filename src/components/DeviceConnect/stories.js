// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import {
  getCryptoCurrencyById,
  listCryptoCurrencies,
} from '@ledgerhq/live-common/lib/helpers/currencies'

import type { Currency } from '@ledgerhq/live-common/lib/types'

import DeviceConnect from 'components/DeviceConnect'

const currencies = listCryptoCurrencies().map(c => c.id)
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
  <Wrapper currencyId={select('currencyId', currencies, 'bitcoin_testnet')}>
    {({ currency }) => (
      <DeviceConnect
        currency={currency}
        appOpened={select('appOpened', ['', 'success', 'fail'], '')}
        devices={devices.slice(0, Number(select('devices', [0, 1, 2, 3], '0')))}
        deviceSelected={devices[select('deviceSelected', ['', 0, 1, 2], '')] || null}
        onChangeDevice={action('onChangeDevice')}
      />
    )}
  </Wrapper>
))

function Wrapper({
  currencyId,
  children,
}: {
  currencyId: string,
  children: (props: { currency: Currency }) => any,
}) {
  const currency = getCryptoCurrencyById(currencyId)
  return children({ currency })
}
