// @flow

import React from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import { ModalFooter } from 'components/base/Modal/index'
import Text from 'components/base/Text'

import IconLock from 'icons/Lock'
import type { StepProps } from '..'
import { Title, Description } from '../helperComponents'

export default (props: StepProps) => {
  const handleSetPassword = () => {
    console.warn('SET PASSWORD TRIGGER') // eslint-disable-line
  }
  const { nextStep, prevStep } = props
  return (
    <Box sticky alignItems="center" justifyContent="center">
      <Box align="center">
        <Title>This is SET PASSWORD screen. 1 line is the maximum</Title>
        <Description>
          This is a long text, please replace it with the final wording once it’s done.
          <br />
          Lorem ipsum dolor amet ledger lorem dolor ipsum amet
        </Description>
        <IconLock size={30} />
        <Button small primary onClick={() => handleSetPassword()}>
          Set Password
        </Button>
        <Box onClick={() => nextStep()} style={{ padding: 15 }}>
          <Text color="smoke">I do not want to set it up</Text>
        </Box>
      </Box>

      <ModalFooter horizontal align="center" justify="flex-end" flow={2}>
        <Button small outline onClick={() => prevStep()}>
          Go Back
        </Button>
        <Button small primary onClick={() => nextStep()}>
          Continue
        </Button>
      </ModalFooter>
    </Box>
  )
}
