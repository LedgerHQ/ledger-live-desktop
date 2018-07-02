// @flow

import React, { PureComponent, Fragment } from 'react'
import { i } from 'helpers/staticPath'

import type { T } from 'types/common'
import type { OnboardingState } from 'reducers/onboarding'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import TrackPage from 'analytics/TrackPage'

import { Title, Description, OnboardingFooterWrapper } from '../../helperComponents'

type Props = {
  t: T,
  redoGenuineCheck: () => void,
  contactSupport: () => void,
  onboarding: OnboardingState,
}

class GenuineCheckErrorPage extends PureComponent<Props, *> {
  trackErrorPage = (page: string) => {
    const { onboarding } = this.props
    return (
      <TrackPage
        category="Onboarding"
        name={`Genuine Check Error Page - ${page}`}
        flowType={onboarding.flowType}
        deviceType={onboarding.isLedgerNano ? 'Nano S' : 'Blue'}
      />
    )
  }

  renderErrorPage = () => {
    const { onboarding, t } = this.props
    return (
      <Fragment>
        {onboarding.genuine.isGenuineFail ? (
          <Fragment>
            {this.trackErrorPage('Not Genuine')}
            <Title>{t('onboarding:genuineCheck.errorPage.title.isGenuineFail')}</Title>
            <Description>{t('onboarding:genuineCheck.errorPage.desc.isGenuineFail')}</Description>
          </Fragment>
        ) : !onboarding.genuine.pinStepPass ? (
          <Fragment>
            {this.trackErrorPage('PIN Step')}
            <Title>{t('onboarding:genuineCheck.errorPage.title.pinFailed')}</Title>
            <Description>{t('onboarding:genuineCheck.errorPage.desc.pinFailed')}</Description>
          </Fragment>
        ) : (
          <Fragment>
            {this.trackErrorPage('Recovery Phase Step')}
            <Title>{t('onboarding:genuineCheck.errorPage.title.recoveryPhraseFailed')}</Title>
            <Description>
              {t('onboarding:genuineCheck.errorPage.desc.recoveryPhraseFailed')}
            </Description>
          </Fragment>
        )}
        <Box mt={5} mr={7}>
          {onboarding.isLedgerNano ? (
            <img alt="" src={i('nano-error-onb.svg')} />
          ) : (
            <img alt="" src={i('blue-error-onb.svg')} />
          )}
        </Box>
      </Fragment>
    )
  }

  render() {
    const { redoGenuineCheck, contactSupport, t } = this.props
    return (
      <Box sticky pt={50}>
        <Box grow alignItems="center" justifyContent="center">
          {this.renderErrorPage()}
        </Box>
        <OnboardingFooterWrapper>
          <Button outlineGrey onClick={() => redoGenuineCheck()}>
            {t('app:common.back')}
          </Button>
          <Button danger onClick={() => contactSupport()} ml="auto">
            {t('onboarding:genuineCheck.buttons.contactSupport')}
          </Button>
        </OnboardingFooterWrapper>
      </Box>
    )
  }
}

export default GenuineCheckErrorPage
