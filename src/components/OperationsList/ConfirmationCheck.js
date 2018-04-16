// @flow

import React from 'react'
import styled from 'styled-components'

import { rgba } from 'styles/helpers'

import type { T } from 'types/common'

import IconClock from 'icons/Clock'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'

import Box from 'components/base/Box'
import Tooltip from 'components/base/Tooltip'

const Container = styled(Box).attrs({
  bg: p =>
    p.isConfirmed
      ? rgba(p.type === 'from' ? p.theme.colors.positiveGreen : p.theme.colors.grey, 0.2)
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
  confirmations,
  minConfirmations,
  t,
  type,
  withTooltip,
  ...props
}: {
  confirmations: number,
  minConfirmations: number,
  t: T,
  type: 'to' | 'from',
  withTooltip?: boolean,
}) => {
  const isConfirmed = confirmations >= minConfirmations

  const renderContent = () => (
    <Container type={type} isConfirmed={isConfirmed} {...props}>
      {type === 'from' ? <IconReceive size={12} /> : <IconSend size={12} />}
      {!isConfirmed && (
        <WrapperClock>
          <IconClock size={10} />
        </WrapperClock>
      )}
    </Container>
  )

  return withTooltip ? (
    <Tooltip
      render={() =>
        isConfirmed ? t('operationsList:confirmed') : t('operationsList:notConfirmed')
      }
    >
      {renderContent()}
    </Tooltip>
  ) : (
    renderContent()
  )
}

ConfirmationCheck.defaultProps = {
  withTooltip: true,
}

export default ConfirmationCheck
