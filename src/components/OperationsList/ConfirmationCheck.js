// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import type { OperationType } from '@ledgerhq/live-common/lib/types'

import { rgba } from 'styles/helpers'

import type { T } from 'types/common'

import IconClock from 'icons/Clock'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'

import Box from 'components/base/Box'
import Tooltip from 'components/base/Tooltip'

const border = p =>
  p.hasFailed
    ? `1px solid ${p.theme.colors.alertRed}`
    : p.isConfirmed
    ? 0
    : `1px solid ${p.type === 'IN' ? p.marketColor : rgba(p.theme.colors.grey, 0.2)}`

const Container = styled(Box).attrs({
  bg: p =>
    p.hasFailed
      ? rgba(p.theme.colors.alertRed, 0.05)
      : p.isConfirmed
      ? rgba(p.type === 'IN' ? p.marketColor : p.theme.colors.grey, 0.2)
      : 'none',
  color: p =>
    p.hasFailed ? p.theme.colors.alertRed : p.type === 'IN' ? p.marketColor : p.theme.colors.grey,
  align: 'center',
  justify: 'center',
})`
  border: ${border};
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

class ConfirmationCheck extends PureComponent<{
  marketColor: string,
  isConfirmed: boolean,
  t: T,
  type: OperationType,
  withTooltip?: boolean,
  hasFailed?: boolean,
}> {
  static defaultProps = {
    withTooltip: true,
  }

  renderTooltip = () => {
    const { t, isConfirmed } = this.props
    return t(isConfirmed ? 'operationDetails.confirmed' : 'operationDetails.notConfirmed')
  }

  render() {
    const { marketColor, isConfirmed, t, type, withTooltip, hasFailed, ...props } = this.props

    const content = (
      <Container
        type={type}
        isConfirmed={isConfirmed}
        marketColor={marketColor}
        hasFailed={hasFailed}
        {...props}
      >
        {type === 'IN' ? <IconReceive size={12} /> : <IconSend size={12} />}
        {!isConfirmed && !hasFailed && (
          <WrapperClock>
            <IconClock size={10} />
          </WrapperClock>
        )}
      </Container>
    )

    return withTooltip ? <Tooltip render={this.renderTooltip}>{content}</Tooltip> : content
  }
}

export default ConfirmationCheck
