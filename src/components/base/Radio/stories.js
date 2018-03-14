import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'

import Radio from 'components/base/Radio'

const stories = storiesOf('Components/base', module)

stories.add('Radio', () => (
  <Radio isChecked={boolean('checked', false)} onChange={action('onChange')} />
))
