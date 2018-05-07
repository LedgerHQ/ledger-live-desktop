// @flow

import React from 'react'

import Button from 'components/base/Button'
import Box from 'components/base/Box'

import type { StepProps } from '..'

export default (props: StepProps) => {
  const { nextStep } = props
  return (
    <Box>
      hey im step init
      <Button onClick={() => nextStep()}>press me for going to prev</Button>
    </Box>
  )
}
