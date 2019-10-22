// @flow

import React, { PureComponent, Fragment } from 'react'
import { i } from 'helpers/staticPath'

import type { T } from 'types/common'
import type { OnboardingState } from 'reducers/onboarding'
import { urls } from 'config/urls'

import InvertableImg from 'components/InvertableImg'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import ExternalLinkButton from 'components/base/ExternalLinkButton'
import TrackPage from 'analytics/TrackPage'
import { getDeviceModel } from '@ledgerhq/devices'

import { Title, Description, OnboardingFooterWrapper } from '../../helperComponents'

const Img = ({ type }: { type: string }) => {
  switch (type) {
    case 'blue':
      return <InvertableImg alt="" src={i('blue-error-onb.svg')} />
    case 'nanoX':
      return <InvertableImg alt="" src={i('nano-x-error-onb.svg')} />
    default:
      return <InvertableImg alt="" src={i('nano-error-onb.svg')} />
  }
}

type Props = {
  t: T,
  redoGenuineCheck: () => void,
  onboarding: OnboardingState,
}

class GenuineCheckErrorPage extends PureComponent<Props, *> {
  trackErrorPage = (page: string) => {
    const { onboarding } = this.props

    const model = getDeviceModel(onboarding.deviceModelId || 'nanoS')

    return (
      <TrackPage
        category="Onboarding"
        name={`Genuine Check Error Page - ${page}`}
        flowType={onboarding.flowType}
        deviceType={model.productName}
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
            <Title>{t('onboarding.genuineCheck.errorPage.title.isGenuineFail')}</Title>
            <Description>{t('onboarding.genuineCheck.errorPage.desc.isGenuineFail')}</Description>
          </Fragment>
        ) : !onboarding.genuine.pinStepPass ? (
          <Fragment>
            {this.trackErrorPage('PIN Step')}
            <Title>{t('onboarding.genuineCheck.errorPage.title.pinFailed')}</Title>
            <Description>{t('onboarding.genuineCheck.errorPage.desc.pinFailed')}</Description>
          </Fragment>
        ) : (
          <Fragment>
            {this.trackErrorPage('Recovery Phase Step')}
            <Title>{t('onboarding.genuineCheck.errorPage.title.recoveryPhraseFailed')}</Title>
            <Description>
              {t('onboarding.genuineCheck.errorPage.desc.recoveryPhraseFailed')}
            </Description>
          </Fragment>
        )}
        <Box mt={5} mr={7}>
          <Img type={onboarding.deviceModelId || 'nanoS'} />
        </Box>
      </Fragment>
    )
  }

  render() {
    const { redoGenuineCheck, t } = this.props
    return (
      <Box sticky pt={50}>
        <Box grow alignItems="center" justifyContent="center">
          {this.renderErrorPage()}
        </Box>
        <OnboardingFooterWrapper>
          <Button outlineGrey onClick={() => redoGenuineCheck()}>
            {t('common.back')}
          </Button>
          <ExternalLinkButton
            danger
            ml="auto"
            label={t('onboarding.genuineCheck.buttons.contactSupport')}
            url={urls.contactSupport}
          />
        </OnboardingFooterWrapper>
      </Box>
    )
  }
}

export default GenuineCheckErrorPage
