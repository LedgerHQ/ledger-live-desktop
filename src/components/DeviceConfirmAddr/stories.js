// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import DeviceConfirmAddr from 'components/DeviceConfirmAddr'

const stories = storiesOf('Components', module)

stories.add('DeviceConfirmAddr', () => <DeviceConfirmAddr notValid={boolean('notValid', false)} />)
