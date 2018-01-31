// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import Checkbox from 'components/base/Checkbox'

const stories = storiesOf('Checkbox', module)

stories.add('basic', () => <Checkbox checked={boolean('checked', false)} />)
