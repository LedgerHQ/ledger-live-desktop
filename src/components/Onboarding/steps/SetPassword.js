// @flow

import React, { PureComponent } from 'react'
import bcrypt from 'bcryptjs'

import { setEncryptionKey } from 'helpers/db'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Text from 'components/base/Text'

import IconSetPassword from 'icons/LockScreen'
import PasswordModal from 'components/SettingsPage/PasswordModal'

import type { StepProps } from '..'

import { Title, Description, OnboardingFooter } from '../helperComponents'

type State = {
  isPasswordModalOpened: boolean,
  isPasswordEnabled: boolean,
}

class SetPassword extends PureComponent<StepProps, State> {
  state = {
    isPasswordModalOpened: false,
    isPasswordEnabled: false,
  }

  handleOpenPasswordModal = () => {
    this.setState({ isPasswordModalOpened: true })
  }
  handleClosePasswordModal = () => {
    this.setState({ isPasswordModalOpened: false })
  }
  handleChangePassword = (password: string) => {
    window.requestIdleCallback(() => {
      setEncryptionKey('accounts', password)
      const hash = password ? bcrypt.hashSync(password, 8) : undefined
      this.props.savePassword(hash)
    })
  }

  handleInputChange = (key: string) => (value: string) => {
    this.setState({ [key]: value })
  }

  render() {
    const { nextStep, prevStep, t } = this.props
    const { isPasswordModalOpened, isPasswordEnabled } = this.state
    return (
      <Box sticky alignItems="center" justifyContent="center">
        <Box align="center">
          <Title>This is SET PASSWORD screen. 1 line is the maximum</Title>
          <Description>
            This is a long text, please replace it with the final wording once it’s done.
            <br />
            Lorem ipsum dolor amet ledger lorem dolor ipsum amet
          </Description>
          <IconSetPassword size={136} />
          <Button small primary onClick={() => this.handleOpenPasswordModal()}>
            Set Password
          </Button>
          {/* we might not be able to re-use what we have currently without modifications
            the title and descriptions are not dynamic, we might need deffirent size as well */}
          {isPasswordModalOpened && (
            <PasswordModal
              t={t}
              isOpened={isPasswordModalOpened}
              onClose={this.handleClosePasswordModal}
              onChangePassword={this.handleChangePassword}
              isPasswordEnabled={isPasswordEnabled}
              currentPasswordHash=""
            />
          )}
          <Box onClick={() => nextStep()} style={{ padding: 15 }}>
            <Text color="smoke">I do not want to set it up</Text>
          </Box>
        </Box>
        <OnboardingFooter horizontal flow={2}>
          <Button small outline onClick={() => prevStep()}>
            Go Back
          </Button>
          <Button small primary onClick={() => nextStep()}>
            Continue
          </Button>
        </OnboardingFooter>
      </Box>
    )
  }
}

export default SetPassword
