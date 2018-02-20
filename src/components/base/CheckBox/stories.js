// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import CheckBox from 'components/base/CheckBox'

const stories = storiesOf('Components/CheckBox', module)

stories.add('basic', () => (
  <CheckBox isChecked={boolean('isChecked', false)} onChange={action('onChange')} />
))
