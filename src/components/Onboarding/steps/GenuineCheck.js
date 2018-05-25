// @flow

import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { radii } from 'styles/theme'

import type { T } from 'types/common'

import { setGenuineCheckFail } from 'reducers/onboarding'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'
import RadioGroup from 'components/base/RadioGroup'
import GenuineCheckModal from 'components/GenuineCheckModal'

import IconLedgerNanoError from 'icons/onboarding/LedgerNanoError'
import IconLedgerBlueError from 'icons/onboarding/LedgerBlueError'
import IconCheck from 'icons/Check'

import { Title, Description, IconOptionRow } from '../helperComponents'

import type { StepProps } from '..'
import OnboardingFooter from '../OnboardingFooter'

const mapDispatchToProps = { setGenuineCheckFail }

type State = {
  pinStepPass: boolean | null,
  phraseStepPass: boolean | null,
  cachedPinStepButton: string,
  cachedPhraseStepButton: string,
  isGenuineCheckModalOpened: boolean,
  isDeviceGenuine: boolean,
}

class GenuineCheck extends PureComponent<StepProps, State> {
  state = {
    pinStepPass: null,
    phraseStepPass: null,
    cachedPinStepButton: '',
    cachedPhraseStepButton: '',
    isGenuineCheckModalOpened: false,
    isDeviceGenuine: false,
  }

  getButtonLabel() {
    const { t } = this.props
    return [
      {
        label: t('common:yes'),
        key: 'yes',
        pass: true,
      },
      {
        label: t('common:no'),
        key: 'no',
        pass: false,
      },
    ]
  }

  handleButtonPass = (item: Object, step: string) => {
    this.setState({ [`${step}`]: item.pass })
    if (step === 'pinStepPass') {
      this.setState({ cachedPinStepButton: item.key })
    } else {
      this.setState({ cachedPhraseStepButton: item.key })
    }

    if (!item.pass) {
      this.props.setGenuineCheckFail(true)
    }
  }

  handleOpenGenuineCheckModal = () => this.setState({ isGenuineCheckModalOpened: true })
  handleCloseGenuineCheckModal = () => this.setState({ isGenuineCheckModalOpened: false })

  handleGenuineCheck = async isGenuine => {
    await new Promise(r => setTimeout(r, 1e3)) // let's wait a bit before closing modal
    this.handleCloseGenuineCheckModal()
    this.setState({ isDeviceGenuine: isGenuine })
  }

  redoGenuineCheck = () => {
    this.props.setGenuineCheckFail(false)
  }

  contactSupport = () => {
    console.log('contact support coming later')
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
    const {
      pinStepPass,
      phraseStepPass,
      cachedPinStepButton,
      cachedPhraseStepButton,
      isGenuineCheckModalOpened,
      isDeviceGenuine,
    } = this.state

    if (onboarding.isGenuineFail) {
      return this.renderGenuineFail()
    }

    return (
      <Box sticky pt={150}>
        <Box grow alignItems="center">
          <Title>{t('onboarding:genuineCheck.title')}</Title>
          <Description>{t('onboarding:genuineCheck.desc')}</Description>
          <Box mt={5}>
            <CardWrapper>
              <Box justify="center">
                <Box horizontal>
                  <IconOptionRow>1.</IconOptionRow>
                  <CardTitle>{t('onboarding:genuineCheck.steps.step1.title')}</CardTitle>
                </Box>
                <CardDescription>{t('onboarding:genuineCheck.steps.step2.desc')}</CardDescription>
              </Box>
              <RadioGroup
                style={{ margin: '0 30px' }}
                items={this.getButtonLabel()}
                activeKey={cachedPinStepButton}
                onChange={item => this.handleButtonPass(item, 'pinStepPass')}
              />
            </CardWrapper>
          </Box>
          <Box mt={5}>
            <CardWrapper isDisabled={!pinStepPass}>
              <Box justify="center">
                <Box horizontal>
                  <IconOptionRow>2.</IconOptionRow>
                  <CardTitle>{t('onboarding:genuineCheck.steps.step2.title')}</CardTitle>
                </Box>
                <CardDescription>{t('onboarding:genuineCheck.steps.step2.desc')}</CardDescription>
              </Box>
              <RadioGroup
                style={{ margin: '0 30px' }}
                items={this.getButtonLabel()}
                activeKey={cachedPhraseStepButton}
                onChange={item => this.handleButtonPass(item, 'phraseStepPass')}
              />
            </CardWrapper>
          </Box>
          <Box mt={5}>
            <CardWrapper isDisabled={!phraseStepPass}>
              <Box justify="center">
                <Box horizontal>
                  <IconOptionRow>3.</IconOptionRow>
                  <CardTitle>{t('onboarding:genuineCheck.steps.step3.title')}</CardTitle>
                </Box>
                <CardDescription>{t('onboarding:genuineCheck.steps.step3.desc')}</CardDescription>
              </Box>
              <Box justify="center" horizontal mx={5}>
                <Button
                  big
                  primary
                  disabled={!phraseStepPass}
                  onClick={this.handleOpenGenuineCheckModal}
                >
                  {isDeviceGenuine ? (
                    <Box horizontal align="center" flow={1}>
                      <IconCheck size={16} />
                      <span>{t('onboarding:genuineCheck.buttons.tryAgain')}</span>
                    </Box>
                  ) : (
                    t('onboarding:genuineCheck.buttons.genuineCheck')
                  )}
                </Button>
              </Box>
            </CardWrapper>
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
        <GenuineCheckModal
          isOpened={isGenuineCheckModalOpened}
          onClose={this.handleCloseGenuineCheckModal}
          onGenuineCheck={this.handleGenuineCheck}
        />
      </Box>
    )
  }
}

export default connect(null, mapDispatchToProps)(GenuineCheck)

// TODO extract to a separate file
export function GenuineCheckFail({
  redoGenuineCheck,
  contactSupport,
  isLedgerNano,
  t,
}: {
  redoGenuineCheck: () => void,
  contactSupport: () => void,
  isLedgerNano: boolean,
  t: T,
}) {
  return (
    <Box sticky pt={250}>
      <Box grow alignItems="center">
        {isLedgerNano ? (
          <Fragment>
            <Title>{t('onboarding:genuineCheck.errorPage.ledgerNano.title')}</Title>
            <Description style={{ maxWidth: 527 }}>
              {t('onboarding:genuineCheck.errorPage.ledgerNano.desc')}
            </Description>
            <Box style={{ minWidth: 527 }}>
              <IconLedgerNanoError />
            </Box>
          </Fragment>
        ) : (
          <Fragment>
            <Title>{t('onboarding:genuineCheck.errorPage.ledgerBlue.title')}</Title>
            <Description style={{ maxWidth: 527 }}>
              {t('onboarding:genuineCheck.errorPage.ledgerBlue.desc')}
            </Description>
            <Box style={{ minWidth: 527, alignItems: 'center' }}>
              <IconLedgerBlueError />
            </Box>
          </Fragment>
        )}
      </Box>
      <Wrapper horizontal>
        <Button
          small
          outline
          onClick={() => {
            redoGenuineCheck()
          }}
        >
          {t('common:back')}
        </Button>
        <Button
          small
          danger
          onClick={() => {
            contactSupport()
          }}
          ml="auto"
        >
          {t('onboarding:genuineCheck.buttons.contactSupport')}
        </Button>
      </Wrapper>
    </Box>
  )
}
export const CardDescription = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'left',
  color: 'grey',
})`
  max-width: 400px;
`
export const CardTitle = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  textAlign: 'left',
  pl: 2,
})``

const Wrapper = styled(Box).attrs({
  px: 5,
  py: 3,
})`
  border-top: 2px solid ${p => p.theme.colors.lightGrey};
  border-bottom-left-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
`
const CardWrapper = styled(Card).attrs({
  horizontal: true,
  p: 5,
})`
  max-height: 97px;
  width: 620px;
  border: ${p => `1px ${p.isDisabled ? 'dashed' : 'solid'} ${p.theme.colors.fog}`};
  pointer-events: ${p => (p.isDisabled ? 'none' : 'auto')};
  background-color: ${p => (p.isDisabled ? p.theme.colors.lightGrey : p.theme.colors.white)};
  opacity: ${p => (p.isDisabled ? 0.7 : 1)};
`
