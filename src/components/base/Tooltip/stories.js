// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'

import Tooltip from 'components/base/Tooltip'

const stories = storiesOf('Components/base', module)

stories.add('Tooltip', () => <Tooltip content={<div>Oyo!</div>}>Hover me!</Tooltip>)
