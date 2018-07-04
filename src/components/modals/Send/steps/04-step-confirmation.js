// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'
import { getAccountOperationExplorer } from '@ledgerhq/live-common/lib/explorers'

import { MODAL_OPERATION_DETAILS } from 'config/constants'
import { colors } from 'styles/theme'
import { multiline } from 'styles/helpers'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Spinner from 'components/base/Spinner'
import TranslatedError from 'components/TranslatedError'
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

export default function StepConfirmation({ t, optimisticOperation, error }: StepProps<*>) {
  const Icon = optimisticOperation ? IconCheckCircle : error ? IconExclamationCircleThin : Spinner
  const iconColor = optimisticOperation
    ? colors.positiveGreen
    : error
      ? colors.alertRed
      : colors.grey
  const tPrefix = optimisticOperation
    ? 'app:send.steps.confirmation.success'
    : error
      ? 'app:send.steps.confirmation.error'
      : 'app:send.steps.confirmation.pending'

  const translatedErrTitle = error ? <TranslatedError error={error} /> || '' : ''
  const translatedErrDesc = error ? <TranslatedError error={error} field="description" /> || '' : ''
  return (
    <Container>
      <TrackPage category="Send Flow" name="Step 4" />
      <span style={{ color: iconColor }}>
        <Icon size={43} />
      </span>
      <Title>{translatedErrTitle || t(`${tPrefix}.title`)}</Title>
      <Text style={{ userSelect: 'text' }} color="smoke">
        {optimisticOperation ? multiline(t(`${tPrefix}.text`)) : error ? translatedErrDesc : null}
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
  const url =
    optimisticOperation && account && getAccountOperationExplorer(account, optimisticOperation)
  return (
    <Fragment>
      <Button onClick={closeModal}>{t('app:common.close')}</Button>
      {optimisticOperation ? (
        url ? (
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
            {t('app:send.steps.confirmation.success.cta')}
          </Button>
        ) : null
      ) : error ? (
        <Button
          ml={2}
          primary
          onClick={() => {
            onRetry()
            transitionTo('amount')
          }}
        >
          {t('app:send.steps.confirmation.error.cta')}
        </Button>
      ) : null}
    </Fragment>
  )
}
