// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import IconCheckFull from 'icons/CheckFull'
import { CurrencyCircleIcon } from '../../../base/CurrencyBadge'
import type { StepProps } from '../index'

const Title = styled(Box).attrs({
  ff: 'Museo Sans',
  fontSize: 5,
  mt: 2,
  color: 'dark',
})`
  text-align: center;
`

const Text = styled(Box).attrs({
  ff: 'Open Sans',
  fontSize: 4,
  mt: 2,
})`
  text-align: center;
`

function StepFinish({ currency, t, checkedAccountsIds }: StepProps) {
  return (
    <Box align="center" py={6}>
      <TrackPage category="AddAccounts" name="Step4" />
      {currency ? (
        <Box color="positiveGreen" style={{ position: 'relative' }}>
          <CurrencyCircleIcon size={50} currency={currency} />
          <IconCheckFull size={18} style={{ position: 'absolute', top: 0, right: 0 }} />
        </Box>
      ) : null}
      <Title>{t('app:addAccounts.success', { count: checkedAccountsIds.length })}</Title>
      <Text>{t('app:addAccounts.successDescription', { count: checkedAccountsIds.length })}</Text>
    </Box>
  )
}

export default StepFinish

export const StepFinishFooter = ({ onCloseModal, onGoStep1, t }: StepProps) => (
  <Fragment>
    <Button mr={2} outline onClick={onGoStep1}>
      {t('app:addAccounts.cta.addMore')}
    </Button>
    <Button primary onClick={onCloseModal}>
      {t('app:common.close')}
    </Button>
  </Fragment>
)
