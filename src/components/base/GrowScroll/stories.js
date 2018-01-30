import React from 'react'
import { storiesOf } from '@storybook/react'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'

const stories = storiesOf('GrowScroll', module)

stories.add('basic', () => (
  <Box style={{ height: 400, border: '1px solid black' }}>
    <GrowScroll>{[...Array(1000).keys()].map(v => <div key={v}>{v}</div>)}</GrowScroll>
  </Box>
))
