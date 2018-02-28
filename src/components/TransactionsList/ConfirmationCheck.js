// @flow

import React from 'react'
import styled from 'styled-components'

import { rgba } from 'styles/helpers'

import Box from 'components/base/Box'
import Tooltip from 'components/base/Tooltip'
import IconCheck from 'icons/Check'
import IconClock from 'icons/Clock'

const Container = styled(Box).attrs({
  bg: p => rgba(p.isConfirmed ? p.theme.colors.positiveGreen : p.theme.colors.grey, 0.1),
  color: p => (p.isConfirmed ? p.theme.colors.positiveGreen : p.theme.colors.grey),
  align: 'center',
  justify: 'center',
})`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`

const ConfirmationCheck = ({
  confirmations,
  minConfirmations,
}: {
  confirmations: number,
  minConfirmations: number,
}) => {
  const isConfirmed = confirmations >= minConfirmations
  return (
    <Tooltip render={() => (isConfirmed ? 'Confirmed' : 'Not confirmed')}>
      <Container isConfirmed={isConfirmed}>
        {isConfirmed ? <IconCheck width={12} /> : <IconClock width={12} />}
      </Container>
    </Tooltip>
  )
}

export default ConfirmationCheck
