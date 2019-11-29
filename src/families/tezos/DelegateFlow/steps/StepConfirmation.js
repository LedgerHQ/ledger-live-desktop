// @flow
import invariant from 'invariant'
import React from 'react'
import styled, { withTheme } from 'styled-components'
import { Trans } from 'react-i18next'

import { MODAL_OPERATION_DETAILS } from 'config/constants'
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
import IconTriangleWarning from 'icons/TriangleWarning'

import type { StepProps } from '../types'

const Container = styled(Box).attrs(() => ({
  alignItems: 'center',
  grow: true,
  color: 'palette.text.shade100',
}))`
  justify-content: ${p => (p.shouldSpace ? 'space-between' : 'center')};
  min-height: 220px;
`

const Title = styled(Box).attrs(() => ({
  ff: 'Inter',
  fontSize: 5,
  mt: 2,
}))`
  text-align: center;
  word-break: break-word;
`

const Text = styled(Box).attrs(() => ({
  ff: 'Inter',
  fontSize: 4,
  mt: 2,
}))`
  text-align: center;
`

const Disclaimer = styled(Box).attrs(() => ({
  horizontal: true,
  align: 'center',
  color: 'palette.background.paper',
  borderRadius: 1,
  p: 3,
  mb: 5,
}))`
  width: 100%;
  background-color: ${p => p.theme.colors.lightRed};
  color: ${p => p.theme.colors.alertRed};
`

function StepConfirmation({
  account,
  t,
  optimisticOperation,
  error,
  signed,
  theme,
  transaction,
}: StepProps & { theme: * }) {
  invariant(
    transaction && transaction.family === 'tezos',
    'transaction is required and must be of tezos family',
  )

  const Icon = optimisticOperation ? IconCheckCircle : error ? IconExclamationCircleThin : Spinner
  const iconColor = optimisticOperation
    ? theme.colors.positiveGreen
    : error
    ? theme.colors.alertRed
    : theme.colors.palette.text.shade60

  const undelegating = transaction.mode === 'undelegate'

  const broadcastError = error && signed

  return (
    <Container shouldSpace={broadcastError}>
      {error && account ? <DebugAppInfosForCurrency /> : null}
      {broadcastError ? (
        <Disclaimer>
          <Box mr={3}>
            <IconTriangleWarning height={16} width={16} />
          </Box>
          <Box style={{ display: 'block' }} ff="Inter|SemiBold" fontSize={3} horizontal shrink>
            <Trans i18nKey="delegation.flow.steps.confirmation.broadcastError" />
          </Box>
        </Disclaimer>
      ) : null}
      <TrackPage category="Delegation Flow" name="Step Confirmed" />
      <span style={{ color: iconColor }}>
        <Icon size={43} />
      </span>
      <Title>
        {error ? (
          <TranslatedError error={error} />
        ) : optimisticOperation ? (
          // TODO: Contextualize message for undelegation
          <Trans
            i18nKey={`delegation.flow.steps.confirmation.success.${
              undelegating ? 'titleUndelegated' : 'title'
            }`}
          />
        ) : (
          <Trans i18nKey="delegation.flow.steps.confirmation.pending.title" />
        )}
      </Title>
      <Text style={{ userSelect: 'text' }} color="palette.text.shade80">
        {optimisticOperation ? (
          // TODO: Contextualize message for undelegation
          multiline(t('delegation.flow.steps.confirmation.success.text'))
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
  parentAccount,
  onRetry,
  optimisticOperation,
  error,
  openModal,
  closeModal,
}: StepProps) {
  const concernedOperation = optimisticOperation
    ? optimisticOperation.subOperations && optimisticOperation.subOperations.length > 0
      ? optimisticOperation.subOperations[0]
      : optimisticOperation
    : null
  return (
    <>
      {concernedOperation ? (
        <Button
          ml={2}
          event="Send Flow Step 4 View OpD Clicked"
          onClick={() => {
            closeModal()
            if (account && concernedOperation) {
              openModal(MODAL_OPERATION_DETAILS, {
                operationId: concernedOperation.id,
                accountId: account.id,
                parentId: parentAccount && parentAccount.id,
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
            transitionTo('summary')
          }}
        />
      ) : null}
    </>
  )
}

export default withTheme(StepConfirmation)
