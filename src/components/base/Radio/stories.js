// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'

import Radio from 'components/base/Radio'

const stories = storiesOf('Radio', module)

stories.add('basic', () => (
  <Radio isChecked={boolean('checked', false)} onChange={action('onChange')} />
))
