// @flow

import React, { PureComponent } from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

import { Title, Description } from '../helperComponents'

import type { StepProps } from '..'
import OnboardingFooter from '../OnboardingFooter'

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
    const { nextStep, prevStep, t } = this.props
    const { showDeviceInfo, currentDevice, showError } = this.state

    return (
      <Box sticky>
        <Box grow alignItems="center" justifyContent="center">
          <Title>{t('onboarding:genuineCheck.title')}</Title>
          <Description>{t('onboarding:genuineCheck.desc')}</Description>
          <Box alignItems="center" justifyContent="center">
            <Title>Coming next week</Title>
            <Box alignItems="center" justifyContent="center" style={{ padding: '15px' }}>
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
            </Box>
          </Box>
        </Box>
        <OnboardingFooter
          horizontal
          align="center"
          flow={2}
          t={t}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      </Box>
    )
  }
}

export default GenuineCheck
