// @flow

import React from 'react'

import { number } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import Bar from 'components/base/Bar'

const stories = storiesOf('Components/base', module)

stories.add('Bar', () => <Bar size={number('size', 1)} color="palette.text.shade60" />)
