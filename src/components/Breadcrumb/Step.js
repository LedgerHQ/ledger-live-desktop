// @flow

import React from 'react'
import styled from 'styled-components'

import { colors } from 'styles/theme'

import Box from 'components/base/Box'

import IconCheck from 'icons/Check'
import IconCross from 'icons/Cross'

const RADIUS = 18

const Wrapper = styled(Box).attrs({
  alignItems: 'center',
  color: p =>
    ['active', 'valid'].includes(p.status) ? 'wallet' : p.status === 'error' ? 'alertRed' : 'grey',
  grow: true,
  justifyContent: 'center',
  relative: true,
})`
  width: ${RADIUS}px;
  flex-shrink: 0;
  text-align: center;
  font-size: 9px;
`

const StepNumber = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: p => (['active', 'valid', 'error'].includes(p.status) ? 'white' : 'fog'),
  bg: p =>
    ['active', 'valid'].includes(p.status) ? 'wallet' : p.status === 'error' ? 'alertRed' : 'white',
  ff: 'Rubik|Regular',
})`
  border-radius: 50%;
  border: 1px solid
    ${p =>
      ['active', 'valid'].includes(p.status)
        ? colors.wallet
        : p.status === 'error'
        ? colors.alertRed
        : colors.fog};
  font-size: 10px;
  height: ${RADIUS}px;
  line-height: 10px;
  transition: all ease-in-out 0.1s ${p => (['active', 'valid'].includes(p.status) ? 0.4 : 0)}s;
  width: ${RADIUS}px;
`

const Label = styled(Box).attrs({
  fontSize: 3,
  ff: 'Museo Sans|Bold',
  px: 2,
})`
  line-height: 1.2;
  position: absolute;
  top: 25px;
  transition: color ease-in-out 0.1s ${p => (['active', 'valid'].includes(p.status) ? 0.4 : 0)}s;
`

type Props = {
  number: number,
  status: 'next' | 'active' | 'valid' | 'error' | 'disable',
  children: any,
}

function Step(props: Props) {
  const { number, status, children } = props
  return (
    <Wrapper status={status}>
      <StepNumber status={status}>
        {status === 'active' || status === 'next' ? (
          number
        ) : status === 'valid' ? (
          <IconCheck size={10} />
        ) : (
          <IconCross size={10} />
        )}
      </StepNumber>
      <Label status={status}>{children}</Label>
    </Wrapper>
  )
}

export default Step
