// @flow
import React from 'react'
import styled from 'styled-components'
import type { Operation } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import Spinner from 'components/base/Spinner'
import IconCheckCircle from 'icons/CheckCircle'
import IconExclamationCircleThin from 'icons/ExclamationCircleThin'
import Box from 'components/base/Box'
import { multiline } from 'styles/helpers'
import { colors } from 'styles/theme'
import TranslatedError from '../../TranslatedError'

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

type Props = {
  optimisticOperation: ?Operation,
  t: T,
  error: ?Error,
}

function StepConfirmation(props: Props) {
  const { t, optimisticOperation, error } = props
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

  return (
    <Container>
      <span style={{ color: iconColor }}>
        <Icon size={43} />
      </span>
      <Title>{t(`${tPrefix}.title`)}</Title>
      <Text style={{ userSelect: 'text' }}>
        {optimisticOperation ? (
          multiline(t(`${tPrefix}.text`))
        ) : error ? (
          <TranslatedError error={error} />
        ) : null}
      </Text>
      <Text style={{ userSelect: 'text' }}>
        {optimisticOperation ? optimisticOperation.hash : ''}
      </Text>
    </Container>
  )
}

export default StepConfirmation
