// @flow

import React from 'react'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

const outerStyle = { width: 0 }
const innerStyle = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

export default ({ children, ...p }: { children: any }) => (
  <Box grow horizontal>
    <Box grow {...p} style={outerStyle}>
      <Text style={innerStyle}>{children}</Text>
    </Box>
  </Box>
)
