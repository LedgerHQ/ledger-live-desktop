// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import styled from 'styled-components'

import type { T } from 'types/common'

import { saveSettings } from 'actions/settings'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

const STEPS = [
  {
    title: ({ t }) => t('onboarding:step1.title'),
    render: ({ t }: StepProps) => <Box>{t('onboarding:step1.greetings')}</Box>,
  },
  {
    title: ({ t }) => t('onboarding:step2.title'),
    render: ({ t }: StepProps) => <Box>{t('onboarding:step2.greetings')}</Box>,
  },
  {
    title: ({ t }) => t('onboarding:step3.title'),
    render: ({ t }: StepProps) => (
      <Box>
        {t('onboarding:step3.greetings')}
        <Box bg="grey" align="center" justify="center" style={{ width: 200, height: 200 }}>
          {'step 3 image'}
        </Box>
        {t('onboarding:step3.description')}
      </Box>
    ),
  },
  {
    title: ({ t }) => t('onboarding:step4.title'),
    render: ({ t }: StepProps) => <Box>{t('onboarding:step4.greetings')}</Box>,
  },
]

const mapStateToProps = state => ({
  hasCompletedOnboarding: state.settings.hasCompletedOnboarding,
})

const mapDispatchToProps = {
  saveSettings,
}

type Props = {
  t: T,
  hasCompletedOnboarding: boolean,
  saveSettings: Function,
}

type StepProps = {
  t: T,
}

type State = {
  stepIndex: number,
}

class Onboarding extends PureComponent<Props, State> {
  state = {
    stepIndex: 0,
  }

  prev = () => this.setState({ stepIndex: Math.max(0, this.state.stepIndex - 1) })
  next = () => this.setState({ stepIndex: Math.min(STEPS.length - 1, this.state.stepIndex + 1) })
  finish = () => this.props.saveSettings({ hasCompletedOnboarding: true })

  render() {
    const { hasCompletedOnboarding, t } = this.props
    const { stepIndex } = this.state

    if (hasCompletedOnboarding) {
      return null
    }

    const step = STEPS[stepIndex]

    if (!step) {
      return null
    }

    const stepProps = {
      t,
    }

    return (
      <Container>
        <Inner>
          <Box horizontal flow={2}>
            <Button primary onClick={this.prev}>
              {'prev step'}
            </Button>
            {stepIndex === STEPS.length - 1 ? (
              <Button danger onClick={this.finish}>
                {'finish'}
              </Button>
            ) : (
              <Button primary onClick={this.next}>
                {'next step'}
              </Button>
            )}
          </Box>
          <StepTitle>{step.title(stepProps)}</StepTitle>
          {step.render(stepProps)}
        </Inner>
      </Container>
    )
  }
}

const Container = styled(Box).attrs({
  bg: 'white',
  p: 6,
  align: 'center',
  justify: 'center',
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
`

const Inner = styled(Box).attrs({
  bg: 'lightGraphite',
  p: 4,
})`
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 400px;
  width: 400px;
  border-radius: 3px;
`

const StepTitle = styled(Box).attrs({
  fontSize: 8,
})``

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(Onboarding)
