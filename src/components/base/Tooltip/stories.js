// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'

import Tooltip from 'components/base/Tooltip'

const stories = storiesOf('Components/base', module)

stories.add('Tooltip', () => <Tooltip render={() => <div>Oyo!</div>}>Hover me!</Tooltip>)
