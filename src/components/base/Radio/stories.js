import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import Radio from 'components/base/Radio'

const stories = storiesOf('Radio', module)

stories.add('basic', () => <Radio checked={boolean('checked', false)} />)
