// @flow

import React, { useRef, useLayoutEffect, useState } from 'react'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Tooltip from 'components/base/Tooltip'
import styled from 'styled-components'

const outerStyle = { width: 0 }
const innerStyle = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

const HiddenText = styled(Box)`
  position: absolute;
  visibility: hidden;
  height: auto;
  width: auto;
  white-space: nowrap;
`

export default ({ children, canSelect, ...p }: { children: any, canSelect?: boolean }) => {
  const textRulerRef = useRef(null)
  const textRef = useRef(null)
  const [textWidth, setTextWidth] = useState(null)
  const [rulerWidth, setRulerWidth] = useState(null)

  useLayoutEffect(() => {
    setTextWidth(textRef.current.clientWidth)
    setRulerWidth(textRulerRef.current.clientWidth)
  }, [children])

  return (
    <Tooltip delay={800} enabled={rulerWidth > textWidth} render={() => children}>
      <Box grow horizontal style={{ position: 'relative' }}>
        <HiddenText {...p} ref={textRulerRef}>
          {children}
        </HiddenText>
        <Box grow {...p} style={outerStyle} ref={textRef}>
          <Text style={{ ...innerStyle, userSelect: canSelect ? 'text' : 'none' }}>{children}</Text>
        </Box>
      </Box>
    </Tooltip>
  )
}
