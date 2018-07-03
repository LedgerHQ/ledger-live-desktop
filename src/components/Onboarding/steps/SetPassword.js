// @flow

import React, { PureComponent, Fragment } from 'react'
import bcrypt from 'bcryptjs'
import { colors } from 'styles/theme'

import { setEncryptionKey } from 'helpers/db'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import TrackPage from 'analytics/TrackPage'

import IconChevronRight from 'icons/ChevronRight'

import PasswordForm from '../../SettingsPage/PasswordForm'
import type { StepProps } from '..'

import {
  Title,
  Description,
  DisclaimerBox,
  FixedTopContainer,
  OnboardingFooterWrapper,
  StepContainerInner,
} from '../helperComponents'

type State = {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  incorrectPassword: boolean,
}

const INITIAL_STATE = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  incorrectPassword: false,
}

class SetPassword extends PureComponent<StepProps, State> {
  state = INITIAL_STATE

  handleSave = (e: SyntheticEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault()
    }
    if (!this.isValid()) {
      return
    }
    const { newPassword } = this.state
    const { nextStep, savePassword } = this.props

    setEncryptionKey('accounts', newPassword)
    const hash = newPassword ? bcrypt.hashSync(newPassword, 8) : undefined
    savePassword(hash)
    this.handleReset()
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
    return newPassword === confirmPassword
  }

  render() {
    const { nextStep, prevStep, t, settings, onboarding } = this.props
    const { newPassword, currentPassword, incorrectPassword, confirmPassword } = this.state

    const isPasswordEnabled = settings.password.isEnabled === true

    const disclaimerNotes = [
      {
        key: 'note1',
        icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
        desc: t('onboarding:setPassword.disclaimer.note1'),
      },
      {
        key: 'note2',
        icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
        desc: t('onboarding:setPassword.disclaimer.note2'),
      },
      {
        key: 'note3',
        icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
        desc: t('onboarding:setPassword.disclaimer.note3'),
      },
    ]

    return (
      <FixedTopContainer>
        <TrackPage
          category="Onboarding"
          name="Set Password"
          flowType={onboarding.flowType}
          deviceType={onboarding.isLedgerNano ? 'Nano S' : 'Blue'}
        />
        <StepContainerInner>
          <Fragment>
            <Box alignItems="center">
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
                isValid={this.isValid}
                onChange={this.handleInputChange}
                t={t}
              />

              <DisclaimerBox mt={7} disclaimerNotes={disclaimerNotes} />
            </Box>
          </Fragment>
        </StepContainerInner>

        <OnboardingFooterWrapper>
          <Button outlineGrey onClick={() => prevStep()}>
            {t('app:common.back')}
          </Button>
          <Box horizontal ml="auto">
            <Button
              event="Onboarding Skip Password"
              onClick={() => nextStep()}
              disabled={false}
              mx={2}
            >
              {t('app:common.skipThisStep')}
            </Button>
            <Button
              onClick={this.handleSave}
              disabled={!this.isValid() || !newPassword.length || !confirmPassword.length}
              primary
            >
              {t('app:common.continue')}
            </Button>
          </Box>
        </OnboardingFooterWrapper>
      </FixedTopContainer>
    )
  }
}

export default SetPassword
