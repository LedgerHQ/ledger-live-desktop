// @flow

import React from 'react'

import { number } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import Tabs from 'components/base/Tabs'

const stories = storiesOf('Components/Tabs', module)

stories.add('basic', () => (
  <Tabs
    index={number('index', 0, {
      min: 0,
      max: 1,
    })}
    onTabClick={action('onTabClick')}
    items={[
      {
        key: 'first',
        title: 'first tab',
        render: () => <div>{'first tab content'}</div>,
      },
      {
        key: 'second',
        title: 'second tab',
        render: () => <div>{'second tab content'}</div>,
      },
    ]}
  />
))
