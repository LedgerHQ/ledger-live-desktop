// @flow

import React from 'react'
import { genAccount } from '@ledgerhq/live-common/lib/mock/account'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import OperationsList from 'components/OperationsList'
import Box from 'components/base/Box'

const stories = storiesOf('Components', module)

const account1 = genAccount('account1')
const account2 = genAccount('account2')

stories.add('OperationsList', () => (
  <Box bg="palette.background.default" p={6} m={-4}>
    <OperationsList accounts={[account1, account2]} withAccount={boolean('withAccount')} />
  </Box>
))
