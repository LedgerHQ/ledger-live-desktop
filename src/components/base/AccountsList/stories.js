// @flow

import React from 'react'
import { genAccount } from '@ledgerhq/live-common/lib/mock/account'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'

import AccountsList from 'components/base/AccountsList'

const stories = storiesOf('Components/base', module)

const ACCOUNTS = [genAccount('a'), genAccount('b'), genAccount('c')]

const CHECKED_IDS = []

stories.add('AccountsList', () => (
  <div style={{ maxWidth: 450 }}>
    <AccountsList
      title={text('title', 'this is an account list')}
      accounts={ACCOUNTS}
      checkedIds={CHECKED_IDS}
      onToggleAccount={action('onToggleAccount')}
      onUpdateAccount={action('onUpdateAccount')}
      onSelectAll={action('onSelectAll')}
      onUnselectAll={action('onUnselectAll')}
      isLoading={boolean('isLoading', false)}
    />
  </div>
))
