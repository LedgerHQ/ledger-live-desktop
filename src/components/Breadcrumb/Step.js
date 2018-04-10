// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const RADIUS = 17

const Wrapper = styled(Box).attrs({
  alignItems: 'center',
  color: p => (p.isActive ? 'wallet' : 'grey'),
  grow: true,
  justifyContent: 'center',
})`
  width: ${RADIUS}px;
  flex-shrink: 0;
  text-align: center;
  font-size: 9px;
`

const Number = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  bg: p => (p.isActive ? 'wallet' : 'fog'),
  ff: 'Rubik|Regular',
})`
  border-radius: 50%;
  font-size: 10px;
  height: ${RADIUS}px;
  line-height: 10px;
  transition: all ease-in-out 0.1s ${p => (p.isActive ? 0.4 : 0)}s;
  width: ${RADIUS}px;
`

const Label = styled(Box).attrs({
  fontSize: 3,
  ff: 'Museo Sans|Bold',
})`
  position: absolute;
  margin-top: 23px;
  transition: color ease-in-out 0.1s ${p => (p.isActive ? 0.4 : 0)}s;
`

type Props = {
  number: number,
  isActive: boolean,
  children: any,
}

function Step(props: Props) {
  const { number, isActive, children } = props
  return (
    <Wrapper isActive={isActive}>
      <Number isActive={isActive}>{number}</Number>
      <Label isActive={isActive}>{children}</Label>
    </Wrapper>
  )
}

export default Step
