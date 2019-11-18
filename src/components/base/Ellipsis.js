// @flow

import React from 'react'
import Text from 'components/base/Text'

const innerStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
}

export default ({ children, canSelect, ...p }: { children: any, canSelect?: boolean }) => (
  <Text style={{ ...innerStyle, userSelect: canSelect ? 'text' : 'none' }} {...p}>
    {children}
  </Text>
)
