// @flow

import React from 'react'

import Box from 'components/base/Box'
import Tooltip from 'components/base/Tooltip'
import IconInfoCircle from 'icons/InfoCircle'

type Props = {
  text: string,
}

function LabelInfoTooltip(props: Props) {
  const { text, ...p } = props
  return (
    <Box {...p}>
      <Tooltip render={() => text} style={{ height: 12 }}>
        <IconInfoCircle size={12} />
      </Tooltip>
    </Box>
  )
}

export default LabelInfoTooltip
