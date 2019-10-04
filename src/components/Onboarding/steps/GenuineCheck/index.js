// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { getDeviceModel } from '@ledgerhq/devices'

import { colors } from 'styles/theme'
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
        label: t('common.labelYes'),
        key: 'yes',
        pass: true,
      },
      {
        label: t('common.labelNo'),
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

    const model = getDeviceModel(onboarding.deviceModelId || 'nanoS')

    return (
      <FixedTopContainer>
        <TrackPage
          category="Onboarding"
          name="Genuine Check"
          flowType={onboarding.flowType}
          deviceType={model.productName}
        />
        <StepContainerInner>
          <Title>{t('onboarding.genuineCheck.title')}</Title>
          <Description>
            {t(
              onboarding.flowType === 'restoreDevice'
                ? 'onboarding.genuineCheck.descRestore'
                : 'onboarding.genuineCheck.descGeneric',
            )}
          </Description>
          <GenuineCheckCardWrapper mt={5}>
            <IconOptionRow>{'1.'}</IconOptionRow>
            <CardTitle>{t('onboarding.genuineCheck.step1.title')}</CardTitle>
            <RadioGroup
              items={this.getButtonLabel()}
              activeKey={cachedPinStepButton}
              onChange={item => this.handleButtonPass(item, 'pinStepPass')}
            />
          </GenuineCheckCardWrapper>
          <GenuineCheckCardWrapper mt={3} isDisabled={!genuine.pinStepPass}>
            <IconOptionRow color={!genuine.pinStepPass ? 'palette.text.shade60' : 'wallet'}>
              {'2.'}
            </IconOptionRow>
            <CardTitle>{t('onboarding.genuineCheck.step2.title')}</CardTitle>
            {genuine.pinStepPass && (
              <RadioGroup
                items={this.getButtonLabel()}
                activeKey={cachedRecoveryStepButton}
                onChange={item => this.handleButtonPass(item, 'recoveryStepPass')}
              />
            )}
          </GenuineCheckCardWrapper>
          <GenuineCheckCardWrapper
            mt={3}
            isDisabled={!genuine.recoveryStepPass}
            isError={genuine.genuineCheckUnavailable}
          >
            <IconOptionRow color={!genuine.recoveryStepPass ? 'palette.text.shade60' : 'wallet'}>
              {'3.'}
            </IconOptionRow>
            <CardTitle>{t('onboarding.genuineCheck.step3.title')}</CardTitle>
            <Spacer />
            {genuine.recoveryStepPass && (
              <Box justify="center">
                {genuine.isDeviceGenuine ? (
                  <Box horizontal align="center" flow={1} color={colors.wallet}>
                    <IconCheck size={16} />
                    <Box ff="Inter|SemiBold" fontSize={4}>
                      {t('onboarding.genuineCheck.isGenuinePassed')}
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
                    {t('onboarding.genuineCheck.buttons.genuineCheck')}
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

export const CardTitle = styled(Box).attrs(() => ({
  ff: 'Inter|SemiBold',
  fontSize: 4,
  textAlign: 'left',
  pl: 2,
}))`
  flex-shrink: 1;
`
export const Spacer = styled.div``
