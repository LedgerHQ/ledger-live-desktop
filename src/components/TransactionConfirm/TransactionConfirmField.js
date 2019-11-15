// @flow

import React from 'react'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

const TransactionConfirmField = ({
  children,
  label,
}: {
  children: React$Node,
  label: React$Node,
}) => (
  <Box horizontal justifyContent="space-between" mb={2}>
    <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={3}>
      {label}
    </Text>
    {children}
  </Box>
)

export default TransactionConfirmField
