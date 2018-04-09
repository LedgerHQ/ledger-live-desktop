// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const RADIUS = 17

const Wrapper = styled(Box).attrs({
  align: 'center',
  justify: 'center',
  color: p => (p.isActive ? 'wallet' : 'grey'),
})`
  width: ${RADIUS}px;
  flex-shrink: 0;
  text-align: center;
  font-size: 9px;
`

const Number = styled(Box).attrs({
  align: 'center',
  justify: 'center',
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

const Bar = styled.div`
  height: 2px;
  background: ${p => p.theme.colors.fog};
  flex-grow: 1;
  max-width: 100px;
  position: relative;
  margin-top: -2px;

  &:after {
    background: ${p => p.theme.colors.pearl};
    content: '';
    display: block;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
    background: ${p => p.theme.colors.wallet};
    transition: transform ease-in-out 0.4s;
    transform-origin: center left;
    transform: scaleX(${p => (p.isActive ? 1 : 0)});
  }
`

const Label = styled(Box).attrs({
  fontSize: 3,
  ff: 'Museo Sans|Bold',
})`
  position: absolute;
  margin-top: 27px;
  transition: color ease-in-out 0.1s ${p => (p.isActive ? 0.4 : 0)}s;
`

type Props = {
  number: number,
  isActive: boolean,
  isFirst: boolean,
  children: any,
}

function Step(props: Props) {
  const { number, isActive, isFirst, children } = props
  return (
    <Fragment>
      {!isFirst && <Bar isActive={isActive} />}
      <Wrapper isActive={isActive}>
        <Number isActive={isActive}>{number}</Number>
        <Label isActive={isActive}>{children}</Label>
      </Wrapper>
    </Fragment>
  )
}

export default Step
