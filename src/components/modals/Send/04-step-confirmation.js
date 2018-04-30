// @flow
import React from 'react'
import styled from 'styled-components'

import IconCheckCircle from 'icons/CheckCircle'
import IconExclamationCircleThin from 'icons/ExclamationCircleThin'
import Box from 'components/base/Box'
import { multiline } from 'styles/helpers'
import { colors } from 'styles/theme'

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
  txValidated: boolean,
  t: T,
}

function StepConfirmation(props: Props) {
  const { t, txValidated } = props
  const Icon = txValidated ? IconCheckCircle : IconExclamationCircleThin
  const iconColor = txValidated ? colors.positiveGreen : colors.alertRed
  const tPrefix = txValidated ? 'send:steps.confirmation.success' : 'send:steps.confirmation.error'

  return (
    <Container>
      <span style={{ color: iconColor }}>
        <Icon size={43} />
      </span>
      <Title>{t(`${tPrefix}.title`)}</Title>
      <Text>{multiline(t(`${tPrefix}.text`))}</Text>
    </Container>
  )
}

export default StepConfirmation
