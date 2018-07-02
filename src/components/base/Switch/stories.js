import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import Switch from 'components/base/Switch'

const stories = storiesOf('Components/base', module)

stories.add('Switch', () => (
  <Switch isChecked={boolean('isChecked', false)} onChange={action('onChange')} />
))
