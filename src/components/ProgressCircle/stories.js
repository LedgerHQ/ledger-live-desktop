// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'

import ProgressCircle from 'components/ProgressCircle'

const stories = storiesOf('Components', module)

stories.add('ProgressCircle', () => (
  <ProgressCircle
    progress={number('progress', 0, { min: 0, max: 1, step: 0.01 })}
    size={number('width', 150, { min: 50, max: 500, step: 10 })}
  />
))
