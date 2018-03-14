import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import CheckBox from 'components/base/CheckBox'

const stories = storiesOf('Components/base', module)

stories.add('CheckBox', () => (
  <CheckBox isChecked={boolean('isChecked', false)} onChange={action('onChange')} />
))
