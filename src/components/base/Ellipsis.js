// @flow

import React from 'react'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

const outerStyle = { width: 0 }
const innerStyle = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

export default ({ children, canSelect, ...p }: { children: any, canSelect?: boolean }) => (
  <Box grow horizontal>
    <Box grow {...p} style={outerStyle}>
      <Text style={{ ...innerStyle, userSelect: canSelect ? 'text' : 'none' }}>{children}</Text>
    </Box>
  </Box>
)
