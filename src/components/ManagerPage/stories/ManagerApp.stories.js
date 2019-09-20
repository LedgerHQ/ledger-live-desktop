// @flow

import React from 'react'

import { storiesOf } from '@storybook/react'
import { text, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import Box from 'components/base/Box'
import ManagerApp from '../ManagerApp'

const stories = storiesOf('Components', module)

const icons = {
  bitcoin: 'bitcoin',
  bitcoin_cash: 'bitcoin_cash',
  bitcoin_gold: 'bitcoin_gold',
  digibyte: 'digibyte',
  hcash: 'hcash',
  qtum: 'qtum',
  pivx: 'pivx',
  stealthcoin: 'stealthcoin',
  vertcoin: 'vertcoin',
  viacoin: 'viacoin',
  ubiq: 'ubiq',
  expanse: 'expanse',
  dash: 'dash',
  dogecoin: 'dogecoin',
  ethereum: 'ethereum',
  fido: 'fido',
  litecoin: 'litecoin',
  stratis: 'stratis',
  ripple: 'ripple',
  zcash: 'zcash',
  komodo: 'komodo',
  ssh: 'ssh',
  posw: 'posw',
  ark: 'ark',
  neo: 'neo',
  stellar: 'stellar',
  monero: 'monero',
  gnupg: 'gnupg',
}

stories.add('ManagerApp', () => (
  <Box bg="palette.background.default" p={6} m={-4}>
    <ManagerApp
      name={text('name', 'Bitcoin')}
      icon={select('icon', icons, 'bitcoin')}
      version={text('version', 'Version 1.0.0')}
      onInstall={action('onInstall')}
    />
  </Box>
))
