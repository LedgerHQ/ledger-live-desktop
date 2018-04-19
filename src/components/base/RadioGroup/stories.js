// @flow

import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { text } from '@storybook/addon-knobs'

import RadioGroup from 'components/base/RadioGroup'

const stories = storiesOf('Components/base', module)

const items = [
  {
    label: 'Btn 1',
    key: 'btn-1',
  },
  {
    label: 'Btn 2',
    key: 'btn-2',
  },
  {
    label: 'Btn 3',
    key: 'btn-3',
  },
  {
    label: 'Btn 4',
    key: 'btn-4',
  },
  {
    label: 'Btn 5',
    key: 'btn-5',
  },
]

stories.add('RadioGroup', () => (
  <RadioGroup items={items} activeKey={text('activeKey', 'btn-1')} onChange={action('onChange')} />
))
