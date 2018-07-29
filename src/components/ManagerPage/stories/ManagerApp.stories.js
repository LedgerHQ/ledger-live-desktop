// @flow

import React from 'react'

import { storiesOf } from '@storybook/react'
import { text, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import Box from 'components/base/Box'
import ManagerApp from '../ManagerApp'

const stories = storiesOf('Components', module)

const icons = {
  ark: 'ark',
  bitcoin: 'bitcoin',
  bitcoin_cash: 'bitcoin_cash',
  bitcoin_gold: 'bitcoin_gold',
  dash: 'dash',
  digibyte: 'digibyte',
  dogecoin: 'dogecoin',
  ethereum: 'ethereum',
  expanse: 'expanse',
  fido: 'fido',
  gnupg: 'gnupg',
  hcash: 'hcash',
  komodo: 'komodo',
  litecoin: 'litecoin',
  monero: 'monero',
  neo: 'neo',
  pivx: 'pivx',
  posw: 'posw',
  qtum: 'qtum',
  ripple: 'ripple',
  ssh: 'ssh',
  stealthcoin: 'stealthcoin',
  stellar: 'stellar',
  stratis: 'stratis',
  ubiq: 'ubiq',
  vertcoin: 'vertcoin',
  viacoin: 'viacoin',
  zcash: 'zcash',
}

stories.add('ManagerApp', () => (
  <Box bg="lightGrey" p={6} m={-4}>
    <ManagerApp
      name={text('name', 'Bitcoin')}
      icon={select('icon', icons, 'bitcoin')}
      version={text('version', 'Version 1.0.0')}
      onInstall={action('onInstall')}
    />
  </Box>
))
