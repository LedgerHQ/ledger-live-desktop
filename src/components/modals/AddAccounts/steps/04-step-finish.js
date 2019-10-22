// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import RefreshAccountsOrdering from 'components/RefreshAccountsOrdering'
import IconCheckFull from 'icons/CheckFull'
import { CurrencyCircleIcon } from '../../../base/CurrencyBadge'
import type { StepProps } from '../index'

const Title = styled(Box).attrs(() => ({
  ff: 'Inter',
  fontSize: 5,
  mt: 2,
  color: 'palette.text.shade100',
}))`
  text-align: center;
`

const Text = styled(Box).attrs(() => ({
  ff: 'Inter',
  fontSize: 4,
  mt: 2,
}))`
  text-align: center;
`

function StepFinish({ currency, t, checkedAccountsIds }: StepProps) {
  return (
    <Box align="center" py={6}>
      <RefreshAccountsOrdering onMount onUnmount />
      {/* onMount because if we already have the countervalues we want to sort it straightaway
          onUnmount because if not, it is useful to trigger a second refresh to ensure it get sorted */}

      <TrackPage category="AddAccounts" name="Step4" />
      {currency ? (
        <Box color="positiveGreen" style={{ position: 'relative' }}>
          <CurrencyCircleIcon size={50} currency={currency} />
          <IconCheckFull size={18} style={{ position: 'absolute', top: 0, right: 0 }} />
        </Box>
      ) : null}
      <Title>{t('addAccounts.success', { count: checkedAccountsIds.length })}</Title>
      <Text>{t('addAccounts.successDescription', { count: checkedAccountsIds.length })}</Text>
    </Box>
  )
}

export default StepFinish

export const StepFinishFooter = ({ onGoStep1, onCloseModal, t }: StepProps) => (
  <Fragment>
    <Box horizontal align="center" justify="flex-end" flow={2}>
      <Button onClick={onCloseModal}>{t('common.close')}</Button>
      <Button primary onClick={onGoStep1}>
        {t('addAccounts.cta.addMore')}
      </Button>
    </Box>
  </Fragment>
)
