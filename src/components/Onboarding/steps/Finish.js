// @flow

import React from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Text from 'components/base/Text'

import IconFinishOnboarding from 'icons/LockScreen'
import type { StepProps } from '..'
import { Title, Description } from '../helperComponents'

export default (props: StepProps) => {
  const { finish, jumpStep } = props
  return (
    <Box sticky alignItems="center" justifyContent="center">
      <Box align="center">
        <Title>This is ENJOY THE APP screen. 1 line is the maximum</Title>
        <Description>
          This is a long text, please replace it with the final wording once it’s done.
          <br />
          Lorem ipsum dolor amet ledger lorem dolor ipsum amet
        </Description>
        <IconFinishOnboarding size={136} />
        <Button small primary onClick={() => finish()}>
          Open App
        </Button>
        <Box onClick={() => jumpStep('start')} style={{ padding: 15 }}>
          <Text color="smoke">I want to go back to Onboarding</Text>
        </Box>
      </Box>
    </Box>
  )
}
