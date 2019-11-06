// @flow

import React from 'react'
import { translate } from 'react-i18next'
import Button from 'components/base/Button'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { getCurrentDevice } from 'reducers/devices'
import { getAccountCurrency } from '@ledgerhq/live-common/lib/account/helpers'

import { NEXT } from '../receiveFlow'
import LinkWithExternalIcon from '../../../base/LinkWithExternalIcon'
import { openURL } from '../../../../helpers/linking'
import { urls } from '../../../../config/urls'
import Box from '../../../base/Box'
import Interactions from '../../../../icons/device/interactions'
import type { T } from '../../../../types/common'
import DebugAppInfosForCurrency from '../../../DebugAppInfosForCurrency'
import TrackPage from '../../../../analytics/TrackPage'
import TranslatedError from '../../../TranslatedError'

type Props = {
  send: string => void,
  context: any,
  t: T,
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

const InformUserStep = ({ send, context: { account, verifyAddressError }, t }: Props) => {
  const device = useSelector(getCurrentDevice)
  const isBlue = device && device.modelId === 'blue'
  const currency = getAccountCurrency(account)

  if (verifyAddressError) {
    return (
      <Container>
        {account ? <DebugAppInfosForCurrency /> : null}
        <TrackPage category="Receive Flow" name="Step 3 Address Not Verified Error" />
        <Title>
          <TranslatedError error={verifyAddressError} />
        </Title>
        <Text mb={5}>
          <TranslatedError error={verifyAddressError} field="description" />
        </Text>
        {!device ? null : (
          <Box pt={isBlue ? 2 : null}>
            <Interactions
              type={device.modelId}
              error={verifyAddressError}
              width={isBlue ? 120 : 375}
              wire="wired"
            />
          </Box>
        )}
      </Container>
    )
  }

  return (
    <Container>
      <Title>{t('receive.steps.confirmAddress.action')}</Title>
      <Text>
        {currency ? t('receive.steps.confirmAddress.text', { currencyName: currency.name }) : null}
      </Text>
      <LinkWithExternalIcon
        onClick={() => openURL(urls.recipientAddressInfo)}
        label={t('common.learnMore')}
      />
      <Button mt={4} mb={2} primary onClick={() => send(NEXT)}>
        {t('common.continue')}
      </Button>
      {!device ? null : (
        <Box pt={isBlue ? 4 : null}>
          <Interactions
            type={device.modelId}
            screen="validation"
            error={false}
            width={isBlue ? 120 : 375}
            wire="wired"
          />
        </Box>
      )}
    </Container>
  )
}

export default translate()(InformUserStep)
