// @flow

import React, { PureComponent } from 'react'
import { openURL } from 'helpers/linking'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { colors } from 'styles/theme'
import { urls } from 'config/urls'

import { updateGenuineCheck } from 'reducers/onboarding'

import Box from 'components/base/Box'
import TrackPage from 'analytics/TrackPage'
import Button from 'components/base/Button'
import RadioGroup from 'components/base/RadioGroup'
import GenuineCheckModal from 'components/GenuineCheckModal'

import IconCross from 'icons/Cross'
import IconCheck from 'icons/Check'

import {
  Title,
  Description,
  IconOptionRow,
  FixedTopContainer,
  StepContainerInner,
  GenuineCheckCardWrapper,
} from '../../helperComponents'

import GenuineCheckErrorPage from './GenuineCheckErrorPage'
import {
  GenuineCheckUnavailableFooter,
  GenuineCheckUnavailableMessage,
} from './GenuineCheckUnavailable'
import OnboardingFooter from '../../OnboardingFooter'

import type { StepProps } from '../..'

const mapDispatchToProps = { updateGenuineCheck }

type State = {
  cachedPinStepButton: string,
  cachedRecoveryStepButton: string,
  isGenuineCheckModalOpened: boolean,
}

const INITIAL_STATE = {
  cachedPinStepButton: '',
  cachedRecoveryStepButton: '',
  isGenuineCheckModalOpened: false,
}

class GenuineCheck extends PureComponent<StepProps, State> {
  state = {
    ...INITIAL_STATE,
    cachedPinStepButton: this.props.onboarding.genuine.pinStepPass ? 'yes' : '',
    cachedRecoveryStepButton: this.props.onboarding.genuine.recoveryStepPass ? 'yes' : '',
  }

  getButtonLabel() {
    const { t } = this.props
    return [
      {
        label: t('app:common.labelYes'),
        key: 'yes',
        pass: true,
      },
      {
        label: t('app:common.labelNo'),
        key: 'no',
        pass: false,
      },
    ]
  }

  handleButtonPass = (item: Object, step: string) => {
    this.props.updateGenuineCheck({ [`${step}`]: item.pass })
    if (step === 'pinStepPass') {
      this.setState({ cachedPinStepButton: item.key })
    } else {
      this.setState({ cachedRecoveryStepButton: item.key })
    }

    if (!item.pass) {
      this.props.updateGenuineCheck({
        displayErrorScreen: true,
      })
    }
  }

  handleOpenGenuineCheckModal = () => {
    this.setState({ isGenuineCheckModalOpened: true })
  }
  handleCloseGenuineCheckModal = (cb?: Function) =>
    this.setState(
      state => ({ ...state, isGenuineCheckModalOpened: false }),
      () => {
        // FIXME: meh
        if (cb && typeof cb === 'function') {
          cb()
        }
      },
    )

  handleGenuineCheckPass = () => {
    this.handleCloseGenuineCheckModal(() => {
      this.props.updateGenuineCheck({
        isDeviceGenuine: true,
        genuineCheckUnavailable: null,
      })
    })
  }
  handleGenuineCheckFailed = () => {
    this.handleCloseGenuineCheckModal(() => {
      this.props.updateGenuineCheck({
        isGenuineFail: true,
        isDeviceGenuine: false,
        genuineCheckUnavailable: null,
        displayErrorScreen: true,
      })
    })
  }

  handleGenuineCheckUnavailable = error => {
    this.handleCloseGenuineCheckModal(() => {
      this.props.updateGenuineCheck({
        isDeviceGenuine: false,
        genuineCheckUnavailable: error,
        displayErrorScreen: false,
      })
    })
  }

  redoGenuineCheck = () => {
    this.setState(INITIAL_STATE)
    this.props.updateGenuineCheck({
      displayErrorScreen: false,
      pinStepPass: false,
      recoveryStepPass: false,
      isGenuineFail: false,
      isDeviceGenuine: false,
      genuineCheckUnavailable: null,
    })
  }

  contactSupport = () => {
    openURL(urls.contactSupport)
  }

  handlePrevStep = () => {
    const { prevStep, onboarding, jumpStep } = this.props
    onboarding.flowType === 'initializedDevice' ? jumpStep('selectDevice') : prevStep()
  }
  handleNextStep = () => {
    const { onboarding, jumpStep, nextStep } = this.props
    onboarding.onboardingRelaunched ? jumpStep('finish') : nextStep()
  }
  renderGenuineFail = () => (
    <GenuineCheckErrorPage
      redoGenuineCheck={this.redoGenuineCheck}
      contactSupport={this.contactSupport}
      t={this.props.t}
      onboarding={this.props.onboarding}
    />
  )

  render() {
    const { nextStep, prevStep, t, onboarding } = this.props
    const { genuine } = onboarding
    const { cachedPinStepButton, cachedRecoveryStepButton, isGenuineCheckModalOpened } = this.state
    if (genuine.displayErrorScreen) {
      return this.renderGenuineFail()
    }

    return (
      <FixedTopContainer>
        <TrackPage
          category="Onboarding"
          name="Genuine Check"
          flowType={onboarding.flowType}
          deviceType={onboarding.isLedgerNano ? 'Nano S' : 'Blue'}
        />
        <StepContainerInner>
          <Title>{t('onboarding:genuineCheck.title')}</Title>
          {onboarding.flowType === 'restoreDevice' ? (
            <Description>{t('onboarding:genuineCheck.descRestore')}</Description>
          ) : (
            <Description>
              {onboarding.isLedgerNano
                ? t('onboarding:genuineCheck.descNano')
                : t('onboarding:genuineCheck.descBlue')}
            </Description>
          )}
          <Box mt={5}>
            <GenuineCheckCardWrapper>
              <Box justify="center">
                <Box horizontal>
                  <IconOptionRow>{'1.'}</IconOptionRow>
                  <CardTitle>{t('onboarding:genuineCheck.step1.title')}</CardTitle>
                </Box>
              </Box>
              <Box justify="center">
                <RadioGroup
                  items={this.getButtonLabel()}
                  activeKey={cachedPinStepButton}
                  onChange={item => this.handleButtonPass(item, 'pinStepPass')}
                />
              </Box>
            </GenuineCheckCardWrapper>
          </Box>
          <Box mt={3}>
            <GenuineCheckCardWrapper isDisabled={!genuine.pinStepPass}>
              <Box justify="center">
                <Box horizontal>
                  <IconOptionRow color={!genuine.pinStepPass ? 'grey' : 'wallet'}>
                    {'2.'}
                  </IconOptionRow>
                  <CardTitle>{t('onboarding:genuineCheck.step2.title')}</CardTitle>
                </Box>
              </Box>
              <Box justify="center">
                {genuine.pinStepPass && (
                  <RadioGroup
                    items={this.getButtonLabel()}
                    activeKey={cachedRecoveryStepButton}
                    onChange={item => this.handleButtonPass(item, 'recoveryStepPass')}
                  />
                )}
              </Box>
            </GenuineCheckCardWrapper>
          </Box>
          <Box mt={3}>
            <GenuineCheckCardWrapper
              isDisabled={!genuine.recoveryStepPass}
              isError={genuine.genuineCheckUnavailable}
            >
              <Box justify="center">
                <Box horizontal>
                  <IconOptionRow color={!genuine.recoveryStepPass ? 'grey' : 'wallet'}>
                    {'3.'}
                  </IconOptionRow>
                  <CardTitle>{t('onboarding:genuineCheck.step3.title')}</CardTitle>
                </Box>
              </Box>
              {genuine.recoveryStepPass && (
                <Box justify="center">
                  {genuine.isDeviceGenuine ? (
                    <Box horizontal align="center" flow={1} color={colors.wallet}>
                      <IconCheck size={16} />
                      <Box ff="Open Sans|SemiBold" fontSize={4}>
                        {t('onboarding:genuineCheck.isGenuinePassed')}
                      </Box>
                    </Box>
                  ) : genuine.genuineCheckUnavailable ? (
                    <Box color="alertRed">
                      <IconCross size={16} />
                    </Box>
                  ) : (
                    <Button
                      primary
                      disabled={!genuine.recoveryStepPass}
                      onClick={this.handleOpenGenuineCheckModal}
                    >
                      {t('onboarding:genuineCheck.buttons.genuineCheck')}
                    </Button>
                  )}
                </Box>
              )}
            </GenuineCheckCardWrapper>
            {genuine.genuineCheckUnavailable && (
              <Box mt={4}>
                <GenuineCheckUnavailableMessage
                  handleOpenGenuineCheckModal={this.handleOpenGenuineCheckModal}
                  onboarding={onboarding}
                  t={t}
                />
              </Box>
            )}
          </Box>
        </StepContainerInner>
        {genuine.genuineCheckUnavailable ? (
          <GenuineCheckUnavailableFooter nextStep={nextStep} prevStep={prevStep} t={t} />
        ) : (
          <OnboardingFooter
            t={t}
            nextStep={this.handleNextStep}
            prevStep={this.handlePrevStep}
            isContinueDisabled={!genuine.isDeviceGenuine}
          />
        )}

        <GenuineCheckModal
          isOpened={isGenuineCheckModalOpened}
          onClose={this.handleCloseGenuineCheckModal}
          onSuccess={this.handleGenuineCheckPass}
          onFail={this.handleGenuineCheckFailed}
          onUnavailable={this.handleGenuineCheckUnavailable}
        />
      </FixedTopContainer>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(GenuineCheck)

export const CardTitle = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  textAlign: 'left',
  pl: 2,
})``
