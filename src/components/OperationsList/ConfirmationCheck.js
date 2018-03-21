// @flow

import React from 'react'
import styled from 'styled-components'

import { rgba } from 'styles/helpers'

import type { T } from 'types/common'

import IconArrowDown from 'icons/ArrowDown'
import IconArrowUp from 'icons/ArrowUp'
import IconClock from 'icons/Clock'

import Box from 'components/base/Box'
import Tooltip from 'components/base/Tooltip'

const Container = styled(Box).attrs({
  bg: p =>
    p.isConfirmed
      ? rgba(p.type === 'from' ? p.theme.colors.positiveGreen : p.theme.colors.grey, 0.1)
      : 'none',
  color: p => (p.type === 'from' ? p.theme.colors.positiveGreen : p.theme.colors.grey),
  align: 'center',
  justify: 'center',
})`
  border: ${p =>
    !p.isConfirmed
      ? `1px solid ${
          p.type === 'from' ? p.theme.colors.positiveGreen : rgba(p.theme.colors.grey, 0.2)
        }`
      : 0};
  border-radius: 50%;
  position: relative;
  height: 24px;
  width: 24px;
`

const WrapperClock = styled(Box).attrs({
  bg: 'white',
  color: 'grey',
})`
  border-radius: 50%;
  position: absolute;
  bottom: -4px;
  right: -4px;
  padding: 1px;
`

const ConfirmationCheck = ({
  type,
  confirmations,
  minConfirmations,
  t,
}: {
  type: 'to' | 'from',
  confirmations: number,
  minConfirmations: number,
  t: T,
}) => {
  const isConfirmed = confirmations >= minConfirmations
  return (
    <Tooltip
      render={() =>
        isConfirmed ? t('operationsList:confirmed') : t('operationsList:notConfirmed')
      }
    >
      <Container type={type} isConfirmed={isConfirmed}>
        {type === 'from' ? <IconArrowDown size={12} /> : <IconArrowUp size={12} />}
        {!isConfirmed && (
          <WrapperClock>
            <IconClock size={10} />
          </WrapperClock>
        )}
      </Container>
    </Tooltip>
  )
}

export default ConfirmationCheck
