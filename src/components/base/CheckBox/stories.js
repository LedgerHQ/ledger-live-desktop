// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import CheckBox from 'components/base/CheckBox'

const stories = storiesOf('CheckBox', module)

stories.add('basic', () => <CheckBox isChecked={boolean('isChecked', false)} />)
