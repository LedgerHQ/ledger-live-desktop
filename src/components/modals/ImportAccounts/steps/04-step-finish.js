// @flow

import React from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import IconCheckCircle from 'icons/CheckCircle'

import type { StepProps } from '../index'

function StepFinish({ onCloseModal }: StepProps) {
  return (
    <Box align="center" py={6}>
      <Box color="positiveGreen" mb={4}>
        <IconCheckCircle size={40} />
      </Box>
      <Box mb={4}>{'Great success!'}</Box>
      <Button primary onClick={onCloseModal}>
        {'Close'}
      </Button>
    </Box>
  )
}

export default StepFinish
