// @flow

import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { getDeviceModel } from '@ledgerhq/devices'

import db from 'helpers/db'
import { saveSettings } from 'actions/settings'
import { withTheme } from 'styled-components'

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
}

const mapDispatchToProps = {
  saveSettings,
}

const INITIAL_STATE = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

type Props = StepProps & {
  saveSettings: any => void,
  theme: any,
}

class SetPassword extends PureComponent<Props, State> {
  state = INITIAL_STATE

  handleSave = async (e: SyntheticEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault()
    }
    if (!this.isValid()) {
      return
    }
    const { newPassword } = this.state
    const { nextStep, saveSettings } = this.props

    await db.setEncryptionKey('app', 'accounts', newPassword)
    saveSettings({ hasPassword: true })
    this.handleReset()
    nextStep()
  }

  handleInputChange = (key: string) => (value: string) => {
    this.setState({ [key]: value })
  }

  handleReset = () => this.setState(INITIAL_STATE)

  isValid = () => {
    const { newPassword, confirmPassword } = this.state
    return newPassword === confirmPassword
  }

  render() {
    const { nextStep, prevStep, t, settings, onboarding, theme } = this.props
    const { newPassword, currentPassword, confirmPassword } = this.state

    const hasPassword = settings.hasPassword === true

    const disclaimerNotes = [
      {
        key: 'note1',
        icon: <IconChevronRight size={12} style={{ color: theme.colors.palette.text.shade80 }} />,
        desc: t('onboarding.setPassword.disclaimer.note1'),
      },
      {
        key: 'note2',
        icon: <IconChevronRight size={12} style={{ color: theme.colors.palette.text.shade80 }} />,
        desc: t('onboarding.setPassword.disclaimer.note2'),
      },
      {
        key: 'note3',
        icon: <IconChevronRight size={12} style={{ color: theme.colors.palette.text.shade80 }} />,
        desc: t('onboarding.setPassword.disclaimer.note3'),
      },
    ]

    return (
      <FixedTopContainer>
        <TrackPage
          category="Onboarding"
          name="Set Password"
          flowType={onboarding.flowType}
          deviceType={getDeviceModel(onboarding.deviceModelId || 'nanoS').productName}
        />
        <StepContainerInner>
          <Fragment>
            <Box alignItems="center">
              <Title>{t('onboarding.setPassword.title')}</Title>
              <Description style={{ maxWidth: 620 }}>
                {t('onboarding.setPassword.desc')}
              </Description>
            </Box>
            <Box align="center" mt={2}>
              <PasswordForm
                onSubmit={this.handleSave}
                hasPassword={hasPassword}
                newPassword={newPassword}
                currentPassword={currentPassword}
                confirmPassword={confirmPassword}
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
            {t('common.back')}
          </Button>
          <Box horizontal ml="auto">
            <Button
              event="Onboarding Skip Password"
              onClick={() => nextStep()}
              disabled={false}
              mx={2}
            >
              {t('common.skipThisStep')}
            </Button>
            <Button
              onClick={this.handleSave}
              disabled={!this.isValid() || !newPassword.length || !confirmPassword.length}
              primary
            >
              {t('common.continue')}
            </Button>
          </Box>
        </OnboardingFooterWrapper>
      </FixedTopContainer>
    )
  }
}

export default withTheme(
  connect(
    null,
    mapDispatchToProps,
  )(SetPassword),
)
