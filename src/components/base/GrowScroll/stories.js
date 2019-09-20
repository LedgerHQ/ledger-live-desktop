// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'

const stories = storiesOf('Components/base', module)

stories.add('GrowScroll', () => {
  const reverseColor = boolean('reverseColor', false)

  return (
    <Box
      bg={reverseColor ? 'palette.text.shade100' : 'palette.background.paper'}
      color={reverseColor ? 'palette.background.paper' : 'palette.text.shade100'}
      style={{
        border: '1px solid palette.text.shade100',
      }}
    >
      <GrowScroll maxHeight={400}>
        {[...Array(1000).keys()].map(v => (
          <div key={v}>{v}</div>
        ))}
      </GrowScroll>
    </Box>
  )
})
