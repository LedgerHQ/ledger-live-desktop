// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

import IconCheck from 'icons/Check'
import IconCross from 'icons/Cross'

const RADIUS = 18

const Wrapper = styled(Box).attrs(p => ({
  alignItems: 'center',
  color: ['active', 'valid'].includes(p.status)
    ? 'wallet'
    : p.status === 'error'
    ? 'alertRed'
    : 'palette.text.shade20',
  grow: true,
  justifyContent: 'center',
  relative: true,
}))`
  width: ${RADIUS}px;
  flex-shrink: 0;
  text-align: center;
  font-size: 9px;
`

const StepNumber = styled(Box).attrs(p => ({
  alignItems: 'center',
  justifyContent: 'center',
  color: ['active', 'valid', 'error'].includes(p.status)
    ? 'palette.primary.contrastText'
    : 'palette.divider',
  bg: ['active', 'valid'].includes(p.status)
    ? 'wallet'
    : p.status === 'error'
    ? 'alertRed'
    : 'palette.background.paper',
  ff: 'Inter|Bold',
}))`
  border-radius: 50%;
  border: 1px solid
    ${p =>
      ['active', 'valid'].includes(p.status)
        ? p.theme.colors.wallet
        : p.status === 'error'
        ? p.theme.colors.alertRed
        : p.theme.colors.palette.divider};
  font-size: 10px;
  height: ${RADIUS}px;
  line-height: 10px;
  transition: all ease-in-out 0.1s ${p => (['active', 'valid'].includes(p.status) ? 0.4 : 0)}s;
  width: ${RADIUS}px;
`

const Label = styled(Box).attrs(() => ({
  fontSize: 3,
  ff: 'Inter|Bold',
  px: 2,
}))`
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
