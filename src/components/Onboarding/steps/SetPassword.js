// @flow

import React, { PureComponent, Fragment } from 'react'
import bcrypt from 'bcryptjs'
import { colors } from 'styles/theme'
import styled from 'styled-components'
import { radii } from 'styles/theme'

import { setEncryptionKey } from 'helpers/db'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

import PasswordModal from 'components/SettingsPage/PasswordModal'
import OnboardingFooter from '../OnboardingFooter'
import IconChevronRight from 'icons/ChevronRight'
import { ErrorMessageInput } from 'components/base/Input'

import PasswordForm from '../../SettingsPage/PasswordForm'
import type { StepProps } from '..'

import { Title, Description, DisclaimerBox, Inner } from '../helperComponents'

type State = {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  incorrectPassword: boolean,
  submitError: boolean,
}

const INITIAL_STATE = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  incorrectPassword: false,
  submitError: false,
}

class SetPassword extends PureComponent<StepProps, State> {
  state = INITIAL_STATE

  handleSave = (e: SyntheticEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault()
    }
    if (!this.isValid()) {
      this.setState({ submitError: true })
      return
    }
    const { newPassword } = this.state
    const { nextStep } = this.props

    setEncryptionKey('accounts', newPassword)
    const hash = newPassword ? bcrypt.hashSync(newPassword, 8) : undefined
    this.props.savePassword(hash)
    nextStep()
  }

  handleInputChange = (key: string) => (value: string) => {
    if (this.state.incorrectPassword) {
      this.setState({ incorrectPassword: false })
    }
    this.setState({ [key]: value })
  }

  handleReset = () => this.setState(INITIAL_STATE)

  isValid = () => {
    const { newPassword, confirmPassword } = this.state
    return newPassword === confirmPassword ? true : false
  }

  render() {
    const { nextStep, prevStep, t, savePassword, settings } = this.props
    const {
      newPassword,
      currentPassword,
      incorrectPassword,
      confirmPassword,
      submitError,
    } = this.state

    const isPasswordEnabled = settings.password.isEnabled === true

    const disclaimerNotes = [
      {
        key: 'note1',
        icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
        desc: t('onboarding:writeSeed.disclaimer.note1'),
      },
      {
        key: 'note2',
        icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
        desc: t('onboarding:writeSeed.disclaimer.note2'),
      },
      {
        key: 'note3',
        icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
        desc: t('onboarding:writeSeed.disclaimer.note3'),
      },
    ]

    return (
      <Box sticky pt={50}>
        <Box grow alignItems="center" justify="center">
          <Fragment>
            <Box mb={3} alignItems="center">
              <Title>{t('onboarding:setPassword.title')}</Title>
              <Description style={{ maxWidth: 620 }}>
                {t('onboarding:setPassword.desc')}
              </Description>
            </Box>
            <Box align="center" mt={2}>
              <PasswordForm
                onSubmit={this.handleSave}
                isPasswordEnabled={isPasswordEnabled}
                newPassword={newPassword}
                currentPassword={currentPassword}
                confirmPassword={confirmPassword}
                incorrectPassword={incorrectPassword}
                onChange={this.handleInputChange}
                t={t}
              />
              {!this.isValid() && (
                <ErrorMessageInput style={{ width: 300 }}>
                  {t('password:errorMessageNotMatchingPassword')}
                </ErrorMessageInput>
              )}
              <DisclaimerBox mt={6} disclaimerNotes={disclaimerNotes} />
            </Box>
          </Fragment>
        </Box>

        <CustomFooter>
          <Button padded outlineGrey onClick={() => prevStep()}>
            {t('common:back')}
          </Button>
          <Box horizontal ml="auto">
            <Button padded disabled={false} onClick={() => nextStep()} mx={2}>
              Skip This Step
            </Button>
            <Button
              padded
              onClick={this.handleSave}
              disabled={!this.isValid() || !newPassword.length || !confirmPassword.length}
              primary
            >
              {t('common:continue')}
            </Button>
          </Box>
        </CustomFooter>
      </Box>
    )
  }
}

export default SetPassword

const CustomFooter = styled(Box).attrs({
  px: 5,
  py: 3,
  horizontal: true,
  align: 'center',
})`
  border-top: 1px solid ${p => p.theme.colors.lightFog};
  border-bottom-left-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
`
