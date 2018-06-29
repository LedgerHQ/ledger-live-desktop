// @flow

import React from 'react'

import { storiesOf } from '@storybook/react'
import { text, number, boolean } from '@storybook/addon-knobs'

import Progress from 'components/base/Progress'

const stories = storiesOf('Components/base', module)

stories.add('Progress (infinite)', () => (
  <Progress
    infinite={boolean('infinite', true)}
    timing={number('timing (ms)', 3000)}
    color={text('color (css or from theme)', 'wallet')}
  />
))
stories.add('Progress', () => (
  <Progress
    infinite={boolean('infinite', false)}
    timing={number('timing (ms)', 3000)}
    color={text('color (css or from theme)', 'wallet')}
  />
))
