import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'

import CheckBox from 'components/base/CheckBox'

const stories = storiesOf('Components/base', module)

stories.add('CheckBox', () => (
  <CheckBox isChecked={boolean('checked', false)} onChange={action('onChange')} />
))
