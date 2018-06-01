// @flow
import React from 'react'
import styled from 'styled-components'
import type { Operation } from '@ledgerhq/live-common/lib/types'

import IconCheckCircle from 'icons/CheckCircle'
import IconExclamationCircleThin from 'icons/ExclamationCircleThin'
import Box from 'components/base/Box'
import { multiline } from 'styles/helpers'
import { colors } from 'styles/theme'
import { formatError } from 'helpers/errors'

import type { T } from 'types/common'

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
  mt: 4,
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
  const Icon = optimisticOperation ? IconCheckCircle : IconExclamationCircleThin
  const iconColor = optimisticOperation ? colors.positiveGreen : colors.alertRed
  const tPrefix = optimisticOperation
    ? 'send:steps.confirmation.success'
    : 'send:steps.confirmation.error'

  return (
    <Container>
      <span style={{ color: iconColor }}>
        <Icon size={43} />
      </span>
      <Title>{t(`${tPrefix}.title`)}</Title>
      <Text style={{ userSelect: 'text' }}>
        {optimisticOperation ? multiline(t(`${tPrefix}.text`)) : error ? formatError(error) : null}
      </Text>
      <Text style={{ userSelect: 'text' }}>
        {optimisticOperation ? optimisticOperation.hash : ''}
      </Text>
    </Container>
  )
}

export default StepConfirmation
