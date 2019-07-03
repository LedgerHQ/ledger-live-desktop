// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'

import { SideBarList, SideBarListItem } from 'components/base/SideBar'
import Box from 'components/base/Box'

import IconAccountSettings from 'icons/AccountSettings'
import IconPrint from 'icons/Print'
import IconControls from 'icons/Controls'
import IconCurrencies from 'icons/Currencies'
import IconExclamationCircle from 'icons/ExclamationCircle'

const stories = storiesOf('Components/base/SideBar', module)

const SIDEBAR_ITEMS = [
  {
    key: 'first',
    label: 'First',
    icon: IconAccountSettings,
    iconActiveColor: '#ffae35',
  },
  {
    key: 'second',
    label: 'Second',
    icon: IconPrint,
    iconActiveColor: '#0ebdcd',
    isActive: true,
  },
  {
    key: 'third',
    label: 'Third very very very very long text very long text very long',
    icon: IconControls,
    iconActiveColor: '#27a2db',
  },
  {
    key: 'fourth',
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
    key: 'fifth',
    label: 'Fifth',
    icon: IconExclamationCircle,
    iconActiveColor: '#0e76aa',
  },
]

stories.add('SideBarList', () => (
  <SideBarList>
    {SIDEBAR_ITEMS.map(item => (
      <SideBarListItem key={item.key} {...item} />
    ))}
  </SideBarList>
))
