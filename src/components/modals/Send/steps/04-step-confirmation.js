// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'

import { MODAL_OPERATION_DETAILS } from 'config/constants'
import { colors } from 'styles/theme'
import { multiline } from 'styles/helpers'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Spinner from 'components/base/Spinner'
import RetryButton from 'components/base/RetryButton'
import TranslatedError from 'components/TranslatedError'
import DebugAppInfosForCurrency from 'components/DebugAppInfosForCurrency'
import IconCheckCircle from 'icons/CheckCircle'
import IconExclamationCircleThin from 'icons/ExclamationCircleThin'

import type { StepProps } from '../index'

const Container = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  grow: true,
  color: 'dark',
})`
  height: 220px;
`

const Title = styled(Box).attrs({
  ff: 'Museo Sans',
  fontSize: 5,
  mt: 2,
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

export default function StepConfirmation({ account, t, optimisticOperation, error }: StepProps<*>) {
  const Icon = optimisticOperation ? IconCheckCircle : error ? IconExclamationCircleThin : Spinner
  const iconColor = optimisticOperation
    ? colors.positiveGreen
    : error
      ? colors.alertRed
      : colors.grey

  return (
    <Container>
      {error && account ? <DebugAppInfosForCurrency currencyId={account.currency.id} /> : null}
      <TrackPage category="Send Flow" name="Step 4" />
      <span style={{ color: iconColor }}>
        <Icon size={43} />
      </span>
      <Title>
        {error ? (
          <TranslatedError error={error} />
        ) : optimisticOperation ? (
          t('send.steps.confirmation.success.title')
        ) : (
          t('send.steps.confirmation.pending.title')
        )}
      </Title>
      <Text style={{ userSelect: 'text' }} color="smoke">
        {optimisticOperation ? (
          multiline(t('send.steps.confirmation.success.text'))
        ) : error ? (
          <TranslatedError error={error} field="description" />
        ) : null}
      </Text>
    </Container>
  )
}

export function StepConfirmationFooter({
  t,
  transitionTo,
  account,
  onRetry,
  optimisticOperation,
  error,
  openModal,
  closeModal,
}: StepProps<*>) {
  return (
    <Fragment>
      {optimisticOperation ? (
        <Button
          ml={2}
          event="Send Flow Step 4 View OpD Clicked"
          onClick={() => {
            closeModal()
            if (account && optimisticOperation) {
              openModal(MODAL_OPERATION_DETAILS, {
                operationId: optimisticOperation.id,
                accountId: account.id,
              })
            }
          }}
          primary
        >
          {t('send.steps.confirmation.success.cta')}
        </Button>
      ) : error ? (
        <RetryButton
          ml={2}
          primary
          onClick={() => {
            onRetry()
            transitionTo('amount')
          }}
        />
      ) : null}
    </Fragment>
  )
}
