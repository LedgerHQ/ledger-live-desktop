// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import DeviceConfirm from 'components/DeviceConfirm'

const stories = storiesOf('Components', module)

stories.add('DeviceConfirm', () => <DeviceConfirm notValid={boolean('notValid', false)} />)
