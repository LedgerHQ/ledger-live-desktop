// @flow

import React from 'react'

import Text from 'components/base/Text'
import Box from 'components/base/Box'

type Props = {
  ff?: string | number,
  ffBold?: string | number,
  isBold: boolean,
  children: any,
}

function BoldToggle(props: Props) {
  const { ff, ffBold, isBold, children, ...p } = props
  return (
    <Box relative>
      <Text ff={ffBold} style={{ opacity: isBold ? 1 : 0 }} {...p}>
        {children}
      </Text>
      {!isBold && (
        <Box sticky alignItems="center" justifyContent="center">
          <Text ff={ff} {...p}>
            {children}
          </Text>
        </Box>
      )}
    </Box>
  )
}

BoldToggle.defaultProps = {
  ff: 'Inter',
  ffBold: 'Inter|SemiBold',
}

export default BoldToggle
