// @flow

import React, { PureComponent, Fragment } from 'react'
import { shell } from 'electron'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { colors } from 'styles/theme'

import type { T } from 'types/common'

import { updateGenuineCheck } from 'reducers/onboarding'

import Box from 'components/base/Box'
import FakeLink from 'components/base/FakeLink'
import Button from 'components/base/Button'
import RadioGroup from 'components/base/RadioGroup'
import GenuineCheckModal from 'components/GenuineCheckModal'
import TranslatedError from 'components/TranslatedError'

import IconLedgerNanoError from 'icons/illustrations/LedgerNanoError'
import IconLedgerBlueError from 'icons/illustrations/LedgerBlueError'
import IconCheck from 'icons/Check'
import IconCross from 'icons/Cross'

import {
  Title,
  Description,
  IconOptionRow,
  FixedTopContainer,
  StepContainerInner,
  OnboardingFooterWrapper,
} from '../helperComponents'

import type { StepProps } from '..'
import OnboardingFooter from '../OnboardingFooter'

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
        label: t('app:common.yes'),
        key: 'yes',
        pass: true,
      },
      {
        label: t('app:common.no'),
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
      this.setState(INITIAL_STATE)
      this.props.updateGenuineCheck({
        displayErrorScreen: true,
        pinStepPass: false,
        recoveryStepPass: false,
        isGenuineFail: false,
        isDeviceGenuine: false,
        genuineCheckUnavailable: null,
      })
    }
  }

  handleOpenGenuineCheckModal = () => this.setState({ isGenuineCheckModalOpened: true })
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
    this.props.updateGenuineCheck({ displayErrorScreen: false })
  }

  contactSupport = () => {
    const contactSupportUrl =
      'https://support.ledgerwallet.com/hc/en-us/requests/new?ticket_form_id=248165'
    shell.openExternal(contactSupportUrl)
  }

  renderGenuineFail = () => (
    <GenuineCheckFail
      redoGenuineCheck={this.redoGenuineCheck}
      contactSupport={this.contactSupport}
      t={this.props.t}
      isLedgerNano={this.props.onboarding.isLedgerNano}
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
            <CardWrapper>
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
            </CardWrapper>
          </Box>
          <Box mt={3}>
            <CardWrapper isDisabled={!genuine.pinStepPass}>
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
            </CardWrapper>
          </Box>
          <Box mt={3}>
            <CardWrapper isDisabled={!genuine.recoveryStepPass}>
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
                      <GenuineSuccessText>
                        {t('onboarding:genuineCheck.isGenuinePassed')}
                      </GenuineSuccessText>
                    </Box>
                  ) : genuine.genuineCheckUnavailable ? (
                    <Box align="center" flow={1} color={colors.alertRed}>
                      <FakeLink
                        ff="Open Sans|Regular"
                        fontSize={4}
                        underline
                        onClick={this.handleOpenGenuineCheckModal}
                      >
                        {t('app:common.retry')}
                      </FakeLink>
                      <Box horizontal justify="center">
                        <Box justifyContent="center">
                          <IconCross size={12} />
                        </Box>
                        <Box ff="Open Sans|Regular" fontSize={2} ml={1}>
                          <TranslatedError error={genuine.genuineCheckUnavailable} />
                        </Box>
                      </Box>
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
            </CardWrapper>
          </Box>
        </StepContainerInner>
        {genuine.genuineCheckUnavailable ? (
          <OnboardingFooterWrapper>
            <Button padded outlineGrey onClick={() => prevStep()}>
              {t('app:common.back')}
            </Button>
            <Box horizontal ml="auto">
              <Button padded disabled={false} onClick={() => nextStep()} mx={2}>
                {t('app:common.skipThisStep')}
              </Button>
              <Button padded onClick={nextStep} disabled primary>
                {t('app:common.continue')}
              </Button>
            </Box>
          </OnboardingFooterWrapper>
        ) : (
          <OnboardingFooter
            horizontal
            align="center"
            flow={2}
            t={t}
            nextStep={nextStep}
            prevStep={prevStep}
            isContinueDisabled={!genuine.isDeviceGenuine}
          />
        )}

        <GenuineCheckModal
          isOpened={isGenuineCheckModalOpened}
          onClose={this.handleCloseGenuineCheckModal}
          onGenuineCheckPass={this.handleGenuineCheckPass}
          onGenuineCheckFailed={this.handleGenuineCheckFailed}
          onGenuineCheckUnavailable={this.handleGenuineCheckUnavailable}
        />
      </FixedTopContainer>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(GenuineCheck)

// TODO extract to a separate file
export function GenuineCheckFail({
  redoGenuineCheck,
  contactSupport,
  isLedgerNano,
  t,
}: {
  redoGenuineCheck: () => void,
  contactSupport: () => void,
  isLedgerNano: boolean | null,
  t: T,
}) {
  return (
    <Box sticky pt={50}>
      <Box grow alignItems="center" justifyContent="center">
        {isLedgerNano ? (
          <Fragment>
            <Title>{t('onboarding:genuineCheck.errorPage.ledgerNano.title')}</Title>
            <Description>{t('onboarding:genuineCheck.errorPage.ledgerNano.desc')}</Description>
            <Box style={{ width: 550 }} mt={5} ml={100}>
              <IconLedgerNanoError />
            </Box>
          </Fragment>
        ) : (
          <Fragment>
            <Title>{t('onboarding:genuineCheck.errorPage.ledgerBlue.title')}</Title>
            <Description pb={5}>
              {t('onboarding:genuineCheck.errorPage.ledgerBlue.desc')}
            </Description>
            <Box alignItems="center">
              <IconLedgerBlueError />
            </Box>
          </Fragment>
        )}
      </Box>
      <OnboardingFooterWrapper>
        <Button padded outlineGrey onClick={() => redoGenuineCheck()}>
          {t('app:common.back')}
        </Button>
        <Button padded danger onClick={() => contactSupport()} ml="auto">
          {t('onboarding:genuineCheck.buttons.contactSupport')}
        </Button>
      </OnboardingFooterWrapper>
    </Box>
  )
}
export const GenuineSuccessText = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
})``

export const CardTitle = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  textAlign: 'left',
  pl: 2,
})``

const CardWrapper = styled(Box).attrs({
  horizontal: true,
  p: 5,
  borderRadius: '4px',
  justify: 'space-between',
})`
  width: 580px;
  height: 74px;
  transition: all ease-in-out 0.2s;
  color: ${p => (p.isDisabled ? p.theme.colors.grey : p.theme.colors.black)};
  border: ${p => `1px ${p.isDisabled ? 'dashed' : 'solid'} ${p.theme.colors.fog}`};
  pointer-events: ${p => (p.isDisabled ? 'none' : 'auto')};
  background-color: ${p => (p.isDisabled ? p.theme.colors.lightGrey : p.theme.colors.white)};
  opacity: ${p => (p.isDisabled ? 0.7 : 1)};
  &:hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  }
`
