// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'

import ProgressBar from 'components/ProgressBar'

const stories = storiesOf('Components', module)

stories.add('ProgressBar', () => (
  <ProgressBar
    progress={number('progress', 0, { min: 0, max: 1, step: 0.05 })}
    width={number('width', 200, { min: 50, max: 500, step: 10 })}
  />
))
