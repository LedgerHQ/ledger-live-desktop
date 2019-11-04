// @flow

import React, { useState } from 'react'
import { ModalBody } from 'components/base/Modal'
import { Trans } from 'react-i18next'
import Button from 'components/base/Button'

import { DEVICE_READY } from '../receiveFlow'
import LinkWithExternalIcon from '../../../base/LinkWithExternalIcon'
import { openURL } from '../../../../helpers/linking'
import { urls } from '../../../../config/urls'
import Box from '../../../base/Box'
import Interactions from '../../../../icons/device/interactions'
import styled from 'styled-components'

type Props = {
  send: string => void,
  context: any
}

const Container = styled(Box).attrs(() => ({
  alignItems: 'center',
  fontSize: 4,
  color: 'palette.text.shade100',
  px: 5,
  mb: 2,
}))``

const Title = styled(Box).attrs(() => ({
  ff: 'Inter|SemiBold',
  fontSize: 6,
  mb: 1,
}))``

const Text = styled(Box).attrs(() => ({
  color: 'palette.text.shade80',
}))`
  text-align: center;
`

const PrepareDeviceStep = ({ send, context, t }: Props) => {
  const [ deviceReady, setDeviceReady ] = useState(false)

  const {
    account
  } = context

  const mainAccount = account
  const tokenCur = (account && account.type === 'TokenAccount' && account.token)

  return (
    <ModalBody
      render={() => (
        <Container>
          <Title>{t('receive.steps.confirmAddress.action')}</Title>
          <Text>
            {currency
              ? t('receive.steps.confirmAddress.text', { currencyName: currency.name })
              : null}
          </Text>
          <LinkWithExternalIcon
            onClick={() => openURL(urls.recipientAddressInfo)}
            label={t('common.learnMore')}
          />
          <Button mt={4} mb={2} primary onClick={() => transitionTo('receive')}>
            {t('common.continue')}
          </Button>
          {!device ? null : (
            <Box pt={isBlue ? 4 : null}>
              <Interactions
                type={device.modelId}
                screen="validation"
                error={verifyAddressError}
                width={isBlue ? 120 : 375}
                wire="wired"
              />
            </Box>
          )}
        </Container>
      )}
      renderFooter={() => (
        <Button
          disabled={!deviceReady}
          primary
          onClick={() => send(DEVICE_READY)}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      )}
    />
  )
}

export default PrepareDeviceStep