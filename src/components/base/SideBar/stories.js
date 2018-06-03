// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { select } from '@storybook/addon-knobs'

import { SideBarList } from 'components/base/SideBar'
import Box from 'components/base/Box'

import IconAccountSettings from 'icons/AccountSettings'
import IconPrint from 'icons/Print'
import IconControls from 'icons/Controls'
import IconCurrencies from 'icons/Currencies'
import IconExclamationCircle from 'icons/ExclamationCircle'

const stories = storiesOf('Components/base/SideBar', module)

const SIDEBAR_ITEMS = [
  {
    value: 'first',
    label: 'First',
    icon: IconAccountSettings,
    iconActiveColor: '#ffae35',
  },
  {
    value: 'second',
    label: 'Second',
    icon: IconPrint,
    iconActiveColor: '#0ebdcd',
  },
  {
    value: 'third',
    label: 'Third very very very very long text very long text very long',
    icon: IconControls,
    iconActiveColor: '#27a2db',
    hasNotif: true,
  },
  {
    value: 'fourth',
    label: () => (
      <Box>
        {'custom'}
        <Box>{'render'}</Box>
      </Box>
    ),
    icon: IconCurrencies,
    iconActiveColor: '#3ca569',
  },
  {
    value: 'fifth',
    label: 'Fifth',
    icon: IconExclamationCircle,
    iconActiveColor: '#0e76aa',
  },
]

stories.add('SideBarList', () => (
  <SideBarList
    items={SIDEBAR_ITEMS}
    activeValue={select('activeValue', [...SIDEBAR_ITEMS.map(i => i.value), null], 'third')}
  />
))
