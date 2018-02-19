// @flow

import React from 'react'

import Text from 'components/base/Text'
import Box from 'components/base/Box'

type Props = {
  boldWeight?: string | number,
  normalWeight?: string | number,
  isBold: boolean,
  children: any,
}

function BoldToggle(props: Props) {
  const { boldWeight, normalWeight, isBold, children, ...p } = props
  return (
    <Box relative>
      <Text fontWeight={boldWeight} style={{ opacity: isBold ? 1 : 0 }} {...p}>
        {children}
      </Text>
      {!isBold && (
        <Box sticky alignItems="center" justifyContent="center">
          <Text fontWeight={normalWeight} {...p}>
            {children}
          </Text>
        </Box>
      )}
    </Box>
  )
}

BoldToggle.defaultProps = {
  boldWeight: 600,
  normalWeight: 400,
}

export default BoldToggle
