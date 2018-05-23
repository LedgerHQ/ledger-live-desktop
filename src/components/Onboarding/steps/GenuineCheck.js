// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { radii } from 'styles/theme'
import type { T } from 'types/common'

import { setGenuineCheckFail } from 'reducers/onboarding'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'
import IconCheck from 'icons/Check'
import IconLedgerNanoError from 'icons/onboarding/LedgerNanoError'

import { Title, Description, IconOptionRow } from '../helperComponents'

import type { StepProps } from '..'
import OnboardingFooter from '../OnboardingFooter'

const mapDispatchToProps = { setGenuineCheckFail }

type State = {
  pinStepPass: boolean | null,
  phraseStepPass: boolean | null,
}

class GenuineCheck extends PureComponent<StepProps, State> {
  state = {
    pinStepPass: null,
    phraseStepPass: null,
  }

  handleStepPass = (step: string, pass: boolean | null) => {
    this.setState({ [`${step}`]: pass })

    if (typeof pass === 'boolean' && !pass) {
      this.props.setGenuineCheckFail(true)
    }
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
    />
  )

  render() {
    const { nextStep, prevStep, t, onboarding } = this.props
    const { pinStepPass, phraseStepPass } = this.state

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
              {!pinStepPass ? (
                <ButtonCombo handleStepPass={this.handleStepPass} step="pinStepPass" />
              ) : (
                <Box alignItems="center">
                  <IconCheck size={16} />
                </Box>
              )}
            </CardWrapper>
          </Box>
          <Box mt={5}>
            <CardWrapper>
              <Box justify="center">
                <Box horizontal>
                  <IconOptionRow>2.</IconOptionRow>
                  <CardTitle>{t('onboarding:genuineCheck.steps.step2.title')}</CardTitle>
                </Box>
                <CardDescription>{t('onboarding:genuineCheck.steps.step2.desc')}</CardDescription>
              </Box>
              {!phraseStepPass ? (
                <ButtonCombo handleStepPass={this.handleStepPass} step="phraseStepPass" />
              ) : (
                <Box justify="center">
                  <IconCheck size={20} />
                </Box>
              )}
            </CardWrapper>
          </Box>
          <Box mt={5}>
            <CardWrapper>
              <Box justify="center">
                <Box horizontal>
                  <IconOptionRow>3.</IconOptionRow>
                  <CardTitle>{t('onboarding:genuineCheck.steps.step3.title')}</CardTitle>
                </Box>
                <CardDescription>{t('onboarding:genuineCheck.steps.step3.desc')}</CardDescription>
              </Box>
              <Box justify="center" horizontal mx={4}>
                <Button big primary>
                  {t('onboarding:genuineCheck.buttons.genuineCheck')}
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
      </Box>
    )
  }
}

export default connect(null, mapDispatchToProps)(GenuineCheck)

export function ButtonCombo({ handleStepPass, step }: { handleStepPass: any, step: string }) {
  return (
    <Box justify="center" horizontal style={{ margin: '0 20px' }}>
      <Button style={{ padding: '0 20px' }} outline onClick={() => handleStepPass(step, true)}>
        Yes
      </Button>
      <Button style={{ padding: '0 20px' }} outline onClick={() => handleStepPass(step, false)}>
        No
      </Button>
    </Box>
  )
}
// TODO extract to the separate file
export function GenuineCheckFail({
  redoGenuineCheck,
  contactSupport,
  t,
}: {
  redoGenuineCheck: () => void,
  contactSupport: () => void,
  t: T,
}) {
  return (
    <Box sticky pt={150}>
      <Box grow alignItems="center">
        <Title>{t('onboarding:genuineCheck.errorPage.ledgerNano.title')}</Title>
        <Description style={{ maxWidth: 527 }}>
          {t('onboarding:genuineCheck.errorPage.ledgerNano.desc')}
        </Description>
        <Box style={{ minWidth: 527 }}>
          <IconLedgerNanoError />
        </Box>
      </Box>
      <Wrapper horizontal>
        <Button
          small
          outline
          onClick={() => {
            redoGenuineCheck()
          }}
        >
          Back
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
  border: 1px solid #d8d8d8;
  max-height: 97px;
  min-width: 620px;
`
