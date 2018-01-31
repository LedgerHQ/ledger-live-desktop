import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'

const stories = storiesOf('GrowScroll', module)

stories.add('basic', () => {
  const reverseColor = boolean('reverseColor', false)

  return (
    <Box
      borderWidth={1}
      borderColor="night"
      bg={reverseColor ? 'night' : 'white'}
      color={reverseColor ? 'white' : 'night'}
    >
      <GrowScroll maxHeight={400}>
        {[...Array(1000).keys()].map(v => <div key={v}>{v}</div>)}
      </GrowScroll>
    </Box>
  )
})
