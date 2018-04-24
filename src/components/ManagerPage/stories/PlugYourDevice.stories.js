// @flow

import React from 'react'

import { storiesOf } from '@storybook/react'
import { text, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import Box from 'components/base/Box'
import PlugYourDevice from '../PlugYourDevice'

const stories = storiesOf('Components', module)

stories.add('PlugYourDevice', () => (
  <Box bg="lightGrey" p={6}>
    <PlugYourDevice />
  </Box>
))
