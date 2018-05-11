// @flow

import React, { PureComponent } from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

import { Title, Description, OnboardingFooter } from '../helperComponents'

import type { StepProps } from '..'

type State = {
  currentDevice: {
    manufacturer: string,
    release: number,
  },
  showDeviceInfo: boolean,
  showError: boolean,
}

// temp checking the release version of the device if connected

class GenuineCheck extends PureComponent<StepProps, State> {
  state = {
    showDeviceInfo: false,
    currentDevice: { manufacturer: 'Unknown', release: 0 },
    showError: false,
  }

  handleCheckDevice = () => {
    const currentDeviceInfo = this.props.getDeviceInfo()
    if (currentDeviceInfo) {
      this.setState({ showError: false, currentDevice: currentDeviceInfo, showDeviceInfo: true })
    } else {
      this.setState({ showError: true })
    }
  }

  render() {
    const { nextStep, prevStep, jumpStep } = this.props
    const { showDeviceInfo, currentDevice, showError } = this.state

    return (
      <Box sticky alignItems="center" justifyContent="center">
        <Box align="center">
          <Title>This is GENUINE CHECK screen. 1 line is the maximum</Title>
          <Description>
            This is a long text, please replace it with the final wording once it’s done.
            <br />
            Lorem ipsum dolor amet ledger lorem dolor ipsum amet
          </Description>
        </Box>
        <Button big primary onClick={() => this.handleCheckDevice()}>
          Check your device!
        </Button>
        {showDeviceInfo && (
          <Box>
            <Description>
              The manufacturer is <b>{currentDevice.manufacturer}</b>
              The release number is <b>{currentDevice.release}</b>
            </Description>
          </Box>
        )}
        {showError && (
          <Box>
            <Description color="red">Connect your device please</Description>
          </Box>
        )}
        <OnboardingFooter horizontal align="center" justify="flex-end" flow={2}>
          <Button small outline onClick={() => prevStep()}>
            Go Back
          </Button>
          <Button big danger onClick={() => jumpStep('init')}>
            Test JUMP!
          </Button>
          <Button small primary onClick={() => nextStep()}>
            Continue
          </Button>
        </OnboardingFooter>
      </Box>
    )
  }
}

export default GenuineCheck
