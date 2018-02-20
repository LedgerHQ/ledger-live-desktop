// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'

const stories = storiesOf('Components/GrowScroll', module)

stories.add('basic', () => {
  const reverseColor = boolean('reverseColor', false)

  return (
    <Box
      bg={reverseColor ? 'night' : 'white'}
      color={reverseColor ? 'white' : 'night'}
      style={{
        border: '1px solid black',
      }}
    >
      <GrowScroll maxHeight={400}>
        {[...Array(1000).keys()].map(v => <div key={v}>{v}</div>)}
      </GrowScroll>
    </Box>
  )
})
